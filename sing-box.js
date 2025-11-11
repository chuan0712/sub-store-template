const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['✈️ 节点总览'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 香港'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|HK|Hong|🇭🇰/i))
  }
  if (['🇹🇼 台湾'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|TW|Taiwan|🇹🇼/i))
  }
  if (['🇯🇵 日本'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日|JP|Japan|🇯🇵/i))
  }
  if (['🇸🇬 狮城','🇸🇬 新加坡'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /新|SG|Singapore|🇸🇬/i))
  }
  if (['🇺🇸 美国'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|US|United States|🇺🇸/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
