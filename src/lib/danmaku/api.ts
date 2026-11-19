// 弹幕 API 服务封装（通过本地代理转发）
import {
  clearAllDanmakuCache,
  clearDanmakuCache,
  clearDanmakuCacheByTitle,
  clearExpiredDanmakuCache,
  generateCacheKey,
  getDanmakuCacheStats,
  getDanmakuFromCache,
  saveDanmakuToCache,
} from './cache';
import type {
  DanmakuComment,
  DanmakuCommentsResponse,
  DanmakuEpisodesResponse,
  DanmakuMatchRequest,
  DanmakuMatchResponse,
  DanmakuSearchResponse,
  DanmakuSettings,
} from './types';

// 初始化弹幕模块（清理过期缓存）
let _cacheCleanupInitialized = false;

export function initDanmakuModule(): void {
  if (typeof window === 'undefined') return;
  if (_cacheCleanupInitialized) return;

  _cacheCleanupInitialized = true;

  // 启动时清理一次过期缓存
  clearExpiredDanmakuCache()
    .then((count) => {
      if (count > 0) {
        console.log(`[弹幕缓存] 启动清理: 已删除 ${count} 个过期缓存`);
      }
    })
    .catch((error) => {
      console.error('[弹幕缓存] 清理失败:', error);
    });
}

// 导出缓存管理函数
export {
  clearAllDanmakuCache,
  clearDanmakuCache,
  clearDanmakuCacheByTitle,
  clearExpiredDanmakuCache,
  generateCacheKey,
  getDanmakuCacheStats,
  getDanmakuFromCache,
};

// —— 弹幕元数据短期缓存 ——
// 播放器插件就绪重试、换集、重新加载弹幕都会重复请求同一个关键词/动漫，
// 命中这里能省掉一次回源等待（每次 1~4 秒）
const META_MEMO_TTL = 5 * 60 * 1000;
const metaMemo = new Map<string, { at: number; value: unknown }>();

function readMetaMemo<T>(key: string): T | null {
  const hit = metaMemo.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > META_MEMO_TTL) {
    metaMemo.delete(key);
    return null;
  }
  return hit.value as T;
}

function writeMetaMemo(key: string, value: unknown): void {
  if (metaMemo.size > 60) {
    // 不用展开 Map 迭代器（tsconfig 的 target 不支持 downlevelIteration）
    let oldestKey: string | null = null;
    let oldestAt = Infinity;
    metaMemo.forEach((entry, entryKey) => {
      if (entry.at < oldestAt) {
        oldestAt = entry.at;
        oldestKey = entryKey;
      }
    });
    if (oldestKey) metaMemo.delete(oldestKey);
  }
  metaMemo.set(key, { at: Date.now(), value });
}

// 单集弹幕默认回传上限：太大在弱网/手机端要等很久，2000 条对一集/一部电影已足够密
export const DEFAULT_DANMAKU_MAX_COUNT = 2000;

// 读取弹幕上限配置（localStorage.danmakuMaxCount）
// 未设置 -> 默认值；设成 0（不限）-> 用安全上限兜底，避免一次拉数万条卡住播放器
export function getDanmakuMaxCount(): number {
  if (typeof window === 'undefined') return DEFAULT_DANMAKU_MAX_COUNT;
  try {
    const raw = localStorage.getItem('danmakuMaxCount');
    if (raw === null) return DEFAULT_DANMAKU_MAX_COUNT;
    const parsed = parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return DEFAULT_DANMAKU_MAX_COUNT;
    return parsed > 0 ? parsed : 20000;
  } catch (error) {
    return DEFAULT_DANMAKU_MAX_COUNT;
  }
}

// 搜索动漫
export async function searchAnime(
  keyword: string
): Promise<DanmakuSearchResponse> {
  const memoKey = 'search:' + keyword;
  const memo = readMetaMemo<DanmakuSearchResponse>(memoKey);
  if (memo) {
    console.log(`[弹幕缓存] 命中搜索结果: ${keyword}`);
    return memo;
  }
  try {
    const url = `/api/danmaku/search?keyword=${encodeURIComponent(keyword)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('弹幕服务器连接异常，请检查你的设置');
    }

    const data = (await response.json()) as DanmakuSearchResponse;
    if (data.success && data.animes.length > 0) {
      writeMetaMemo(memoKey, data);
    }
    return data;
  } catch (error) {
    console.error('搜索动漫失败:', error);
    return {
      errorCode: -1,
      success: false,
      errorMessage: error instanceof Error ? error.message : '搜索失败',
      animes: [],
    };
  }
}

// 自动匹配（根据文件名）
export async function matchAnime(
  fileName: string
): Promise<DanmakuMatchResponse> {
  try {
    const url = '/api/danmaku/match';
    const requestBody: DanmakuMatchRequest = { fileName };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('弹幕服务器连接异常，请检查你的设置');
    }

    const data = (await response.json()) as DanmakuMatchResponse;
    return data;
  } catch (error) {
    console.error('自动匹配失败:', error);
    return {
      errorCode: -1,
      success: false,
      errorMessage: error instanceof Error ? error.message : '匹配失败',
      isMatched: false,
      matches: [],
    };
  }
}

// 获取剧集列表
export async function getEpisodes(
  animeId: number
): Promise<DanmakuEpisodesResponse> {
  const memoKey = 'episodes:' + animeId;
  const memo = readMetaMemo<DanmakuEpisodesResponse>(memoKey);
  if (memo) {
    console.log(`[弹幕缓存] 命中剧集列表: animeId=${animeId}`);
    return memo;
  }
  try {
    const url = `/api/danmaku/episodes?animeId=${animeId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('弹幕服务器连接异常，请检查你的设置');
    }

    const data = (await response.json()) as DanmakuEpisodesResponse;
    if (data.success && data.bangumi.episodes.length > 0) {
      writeMetaMemo(memoKey, data);
    }
    return data;
  } catch (error) {
    console.error('获取剧集列表失败:', error);
    return {
      errorCode: -1,
      success: false,
      errorMessage: error instanceof Error ? error.message : '获取失败',
      bangumi: {
        bangumiId: '',
        animeTitle: '',
        episodes: [],
      },
    };
  }
}

// 通过剧集 ID 获取弹幕（优先从缓存读取）
export async function getDanmakuById(
  episodeId: number,
  title?: string,
  episodeIndex?: number,
  options?: {
    bypassCache?: boolean;
  },
  metadata?: {
    animeId?: number;
    animeTitle?: string;
    episodeTitle?: string;
    searchKeyword?: string;
    danmakuCount?: number;
  }
): Promise<DanmakuComment[]> {
  // 弹幕上限：默认 2000（与服务端抽样上限一致），弱网下不用等太久
  const limit = getDanmakuMaxCount();

  try {
    // 1. 如果提供了 title 和 episodeIndex，先尝试从缓存读取
    if (title && episodeIndex !== undefined && !options?.bypassCache) {
      const cachedData = await getDanmakuFromCache(title, episodeIndex);
      if (cachedData) {
        console.log(`[弹幕缓存] 使用缓存: title=${title}, episodeIndex=${episodeIndex}, 数量=${cachedData.comments.length}`);
        // 旧缓存可能存了数万条全量数据，按当前上限抽样后再交给播放器
        if (cachedData.comments.length > limit) {
          const step = cachedData.comments.length / limit;
          const sampled: DanmakuComment[] = [];
          for (let i = 0; i < limit; i += 1) {
            sampled.push(cachedData.comments[Math.floor(i * step)]);
          }
          return sampled;
        }
        return cachedData.comments;
      }
      console.log(`[弹幕缓存] 缓存未命中，从 API 获取: title=${title}, episodeIndex=${episodeIndex}`);
    } else if (title && episodeIndex !== undefined && options?.bypassCache) {
      console.log(`[弹幕缓存] 手动选择，跳过缓存读取: title=${title}, episodeIndex=${episodeIndex}, episodeId=${episodeId}`);
    } else {
      console.log(`[弹幕缓存] 未提供 title/episodeIndex，跳过缓存: episodeId=${episodeId}`);
    }

    // 2. 缓存未命中，从 API 获取
    // limit 交给服务端抽样，避免把数万条弹幕整体回传
    const url = `/api/danmaku/comment?episodeId=${episodeId}&limit=${limit}`;

    // 上游弹幕服务偶发长时间无响应，加超时避免界面一直停留在"加载中"
    const response = await (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      try {
        return await fetch(url, { signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }
    })();

    if (!response.ok) {
      throw new Error('弹幕服务器连接异常，请检查你的设置');
    }

    const data = (await response.json()) as DanmakuCommentsResponse;
    const comments = data.comments || [];

    // 3. 如果提供了 title 和 episodeIndex，保存到缓存
    if (comments.length > 0 && title && title.trim() !== '' && episodeIndex !== undefined && episodeIndex >= 0) {
      try {
        console.log(`[弹幕缓存] 尝试保存缓存: title="${title}", episodeIndex=${episodeIndex}, 数量=${comments.length}`);
        await saveDanmakuToCache(title, episodeIndex, comments, {
          animeId: metadata?.animeId,
          episodeId: episodeId,
          animeTitle: metadata?.animeTitle,
          episodeTitle: metadata?.episodeTitle,
          searchKeyword: metadata?.searchKeyword,
          danmakuCount: metadata?.danmakuCount ?? comments.length,
        });
        console.log(`[弹幕缓存] 已缓存: title=${title}, episodeIndex=${episodeIndex}, 数量=${comments.length}`);
      } catch (cacheError) {
        console.error('[弹幕缓存] 保存缓存失败:', cacheError);
        // 缓存失败不影响返回结果
      }
    } else {
      console.log(`[弹幕缓存] 不满足缓存条件: title="${title}", episodeIndex=${episodeIndex}, comments.length=${comments.length}`);
    }

    return comments;
  } catch (error) {
    console.error('获取弹幕失败:', error);
    return [];
  }
}

// 通过视频 URL 获取弹幕
export async function getDanmakuByUrl(url: string): Promise<DanmakuComment[]> {
  try {
    const apiUrl = `/api/danmaku/comment?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('弹幕服务器连接异常，请检查你的设置');
    }

    const data = (await response.json()) as DanmakuCommentsResponse;
    return data.comments || [];
  } catch (error) {
    console.error('获取弹幕失败:', error);
    return [];
  }
}

// opencc-js 繁简转换逻辑已拆到独立客户端文件，避免服务端 bundle 内联其字典
import { convertDanmakuText } from './traditional-to-simplified';

// 将 danmu_api 的弹幕格式转换为 artplayer-plugin-danmuku 格式
export function convertDanmakuFormat(
  comments: DanmakuComment[]
): Array<{
  text: string;
  time: number;
  color: string;
  border: boolean;
  mode: number;
}> {
  return comments.map((comment) => {
    // 解析弹幕属性: "时间,类型,字体,颜色,时间戳,弹幕池,用户Hash,弹幕ID"
    const parts = comment.p.split(',');
    const time = parseFloat(parts[0]) || 0;
    const type = parseInt(parts[1]) || 1; // 1=滚动, 4=底部, 5=顶部
    const colorValue = parseInt(parts[3]) || 16777215; // 默认白色

    // 将十进制颜色值转换为十六进制
    const color = `#${colorValue.toString(16).padStart(6, '0')}`;

    // 转换弹幕类型: 1=滚动(0), 4=底部(1), 5=顶部(2)
    let mode = 0; // 默认滚动
    if (type === 5) mode = 1; // 顶部
    else if (type === 4) mode = 2; // 底部

    return {
      text: convertDanmakuText(comment.m),
      time,
      color,
      border: false,
      mode,
    };
  });
}

// 默认弹幕设置
export const DEFAULT_DANMAKU_SETTINGS: DanmakuSettings = {
  enabled: true,
  opacity: 1,
  fontSize: 25,
  speed: 5,
  marginTop: 10,
  marginBottom: '50%',
  maxlength: 100,
  filterRules: [],
  unlimited: false,
  synchronousPlayback: false,
};

// 从 localStorage 读取弹幕设置
export function loadDanmakuSettings(): DanmakuSettings {
  if (typeof window === 'undefined') return DEFAULT_DANMAKU_SETTINGS;

  try {
    const saved = localStorage.getItem('danmaku_settings');
    let settings = DEFAULT_DANMAKU_SETTINGS;

    if (saved) {
      settings = { ...DEFAULT_DANMAKU_SETTINGS, ...JSON.parse(saved) };
    }

    return settings;
  } catch (error) {
    console.error('读取弹幕设置失败:', error);
  }
  return DEFAULT_DANMAKU_SETTINGS;
}

// 保存弹幕设置到 localStorage
export function saveDanmakuSettings(settings: DanmakuSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('danmaku_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('保存弹幕设置失败:', error);
  }
}

// 保存弹幕显示状态到 localStorage（独立的 key）
export function saveDanmakuDisplayState(enabled: boolean): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('danmaku_display_enabled', String(enabled));
  } catch (error) {
    console.error('保存弹幕显示状态失败:', error);
  }
}

// 读取弹幕显示状态
export function loadDanmakuDisplayState(): boolean | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem('danmaku_display_enabled');
    if (saved === null) return null;
    return saved === 'true';
  } catch (error) {
    console.error('读取弹幕显示状态失败:', error);
    return null;
  }
}

// 记忆上次选择的弹幕
export interface DanmakuMemory {
  videoTitle: string;
  animeId: number;
  episodeId: number;
  animeTitle: string;
  episodeTitle: string;
  timestamp: number;
  searchKeyword?: string; // 用户手动搜索时使用的关键词
}

// 保存弹幕选择记忆
export function saveDanmakuMemory(
  videoTitle: string,
  animeId: number,
  episodeId: number,
  animeTitle: string,
  episodeTitle: string,
  searchKeyword?: string // 可选的搜索关键词
): void {
  if (typeof window === 'undefined') return;

  try {
    const memory: DanmakuMemory = {
      videoTitle,
      animeId,
      episodeId,
      animeTitle,
      episodeTitle,
      timestamp: Date.now(),
      searchKeyword, // 保存搜索关键词
    };

    // 获取现有的记忆
    const memoriesJson = localStorage.getItem('danmaku_memories');
    const memories: Record<string, DanmakuMemory> = memoriesJson
      ? JSON.parse(memoriesJson)
      : {};

    // 保存新记忆
    memories[videoTitle] = memory;

    // 只保留最近 100 条记忆
    const entries = Object.entries(memories);
    if (entries.length > 100) {
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const top100 = entries.slice(0, 100);
      const newMemories = Object.fromEntries(top100);
      localStorage.setItem('danmaku_memories', JSON.stringify(newMemories));
    } else {
      localStorage.setItem('danmaku_memories', JSON.stringify(memories));
    }
  } catch (error) {
    console.error('保存弹幕记忆失败:', error);
  }
}

// 读取弹幕选择记忆
export function loadDanmakuMemory(
  videoTitle: string
): DanmakuMemory | null {
  if (typeof window === 'undefined') return null;

  try {
    const memoriesJson = localStorage.getItem('danmaku_memories');
    if (!memoriesJson) return null;

    const memories: Record<string, DanmakuMemory> = JSON.parse(memoriesJson);
    return memories[videoTitle] || null;
  } catch (error) {
    console.error('读取弹幕记忆失败:', error);
    return null;
  }
}
