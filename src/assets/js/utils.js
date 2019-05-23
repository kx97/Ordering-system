import crypto from 'crypto-js'


export default {
  // 加密
  encrypto: function(word, keystr) {
    keystr = keystr ? keystr : 'abcdefgabcdefg12'
    var key = crypto.enc.Utf8.parse(keystr)
    var str = crypto.enc.Utf8.parse(word)
    var encrypted = crypto.AES.encrypt(str, key, {mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7})
    return encrypted.toString()
  },
  // 解密
  decrypto: function(word, keystr) {
    keystr = keystr ? keystr : 'abcdefgabcdefg12'
    var key = crypto.enc.Utf8.parse(keystr)
    var str = crypto.enc.Utf8.parse(word)
    var decrypt = crypto.AES.decrypt(str, key, {mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7})
    return crypto.enc.Utf8.stringify(decrypt).toString()
  }
}