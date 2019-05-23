function ajax(obj) {
  var ajaxObj = null;
  if(window.XMLHttpRequest) {
    ajaxObj = new XMLHttpRequest()
  }
  // } else {
  //   ajaxObj = new ActiveObject("Microsoft.XMLHTTP")
  // }
  ajaxObj.onreadystatechange = function() {
    if(ajaxObj.readyState == 4) {
      if(ajaxObj.status >= 200 && ajax.status <= 300 || ajaxObj.status == 304) {
        if(obj.success) {
          obj.success(JSON.parse(ajaxObj.responseText))
        } else {
          alert('没有 success 函数')
        }
      }
    } else {
      if(obj.error) {
        obj.error(ajaxObj.status)
      } else {
        alert('没有 error 函数')
      }
    }
  }
  var type = obj.type || 'get'
type = type.toLowerCase()

var params = ''
 if(obj.data) {
   for(var k in obj.data) {
     params += (k + '=' + obj.data[k] + '&') 
   }
   params = params.slice(0, params.length - 1)
 }

 if(type == 'get') {
   ajaxObj.open(type, obj.url + '?' + params, true)
   ajaxObj.send(null)
 } else {
   ajaxObj.open(type, obj.url, true)
   ajaxObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
   ajaxObj.send(params)
 }
}


export default ajax