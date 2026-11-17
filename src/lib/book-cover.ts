/**
 * 书源封面地址 → 本站 https 图片代理地址。
 *
 * 国内书源的封面多数是 http 明文，而本站是 https。浏览器遇到混合内容会自动
 * 把图片升级到 https，源站没开 https（或证书不匹配）就返回 404，封面于是变破图。
 * 统一改走 /api/books/image：同源 https，且代理会带上书源 Referer/UA，顺带解决防盗链。
 *
 * 已经是代理地址、或本身就是 https / data: 的一律原样返回。
 */
export function bookCoverSrc(
  sourceId: string | undefined,
  cover: string | undefined
): string | undefined {
  if (!cover) return cover;
  if (cover.startsWith('/api/books/image')) return cover;
  if (!/^http:\/\//i.test(cover)) return cover;
  if (!sourceId) return cover;

  // 封面地址后面可能跟着 legado 的图片选项 `url,{...}`，要原样带到 options 参数里
  const optionIndex = cover.indexOf(',{');
  const rawSrc = optionIndex > 0 ? cover.slice(0, optionIndex) : cover;
  const options = optionIndex > 0 ? cover.slice(optionIndex + 1) : '';

  const query = `sourceId=${encodeURIComponent(sourceId)}&url=${encodeURIComponent(rawSrc)}`;
  return `/api/books/image?${query}${options ? `&options=${encodeURIComponent(options)}` : ''}`;
}
