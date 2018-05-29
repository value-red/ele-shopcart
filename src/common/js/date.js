export function getTemplateDate (date, temp) {
  temp = temp.replace(/(y+)/, function (temp, $1) {
    return (date.getFullYear() + '').substr(4 - $1.length)
  })
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let key in o) {
    if (new RegExp(`(${key})`).test(temp)) {
      let data = o[key] + ''
      temp = temp.replace(RegExp.$1, (RegExp.$1.length === 1) ? data : addZero(data))
    }
    // let data = o[key] + ''
    // temp = temp.replace(new RegExp(`(${key})`), ( $1.length === 1 ) ? data : addZero(data))
  }
  return temp
}

function addZero (str) {
  return ('00' + str).substr(str.length)
}
