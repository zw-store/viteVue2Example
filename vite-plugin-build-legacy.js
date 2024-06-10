import { execSync } from 'child_process'
import os from 'os'
import fs from 'fs'
const platform = os.platform()

export default function VitePluginBuildLegacy() {
  return {
    name: 'vite-plugin-build-legacy',
    apply: 'build',
    generateBundle(_options, bundle) {
      let content = `| 文件名 | 大小 | \n| :---: | --- | \n`
      const [assets, chunks] = Object.values(bundle).reduce((r, i) => (r[i.type === 'asset' ? 0 : 1].push(i), r), [[], []])
      assets.forEach(item => (content += `| ${item.fileName} | ${formatSize(item.source.length)} | \n`))
      chunks.forEach(item => (content += `| ${item.fileName} | ${formatSize(item.code.length)} | \n`))
      const totalSize = assets.reduce((total, item) => total + item.source.length, 0) + chunks.reduce((total, item) => total + item.code.length, 0)
      content += `| 总计 | ${formatSize(totalSize)}（仅构建资产） | \n`
      this.emitFile({ type: 'asset', fileName: 'assets.md', source: content })
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify(GeneratVersion(), null, 2),
      })
    },
  }
}

function formatSize(size) {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}

export function GeneratVersion(assets_dir) {
  try {
    const commitId = execSync('git log -n1 --format=format:"%H"').toString().trim()
    const author = execSync('git log -n1 --format=format:"%an"').toString().trim()
    let branch

    try {
      branch = execSync('git symbolic-ref --short HEAD').toString().trim()
    } catch (error) {
      branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    }
    const commitTime = execSync('git log -n1 --format=format:"%ad" --date=iso').toString().substring(0, 19)
    const content = execSync('git log -n1 --format=format:"%s"').toString().trim()

    const json = { platform, commitId, author, branch, commitTime, content }

    assets_dir && fs.writeFileSync(assets_dir, JSON.stringify(json, null, 2))

    return json
  } catch (error) {
    return { msg: '获取版本信息失败', error: error.message }
  }
}
