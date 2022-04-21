import defaultSettings from '@/settings'

const title = defaultSettings.title || '上海交通大学专家管理系统'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
