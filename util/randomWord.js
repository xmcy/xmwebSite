var ccap = require('ccap') 

//module.exports = RandomWord;

function RandomWord(chars){
    if(!(this instanceof RandomWord)){
        return new RandomWord(chars);
    }
    this._chars = "";
    if(chars){
        this.add(chars);
    }
}

RandomWord.prototype = {
    add:function(chars){
        this._chars += chars;
        return this;
    },
    random:function(size){
        var len = this._chars.length;
        if(len === 0){
            throw new Error('no chars,please use add(chars)');
        }
        var word = "";
        for(var i=0;i<size;i++){
            var cpo = parseInt(Math.random()*len);
            word += this._chars.charAt(cpo);
        }
        return word;
    }
}

var rw = RandomWord('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
var captcha = ccap({
  width: 130, // set width,default is 256
  height: 50, // set height,default is 60
  offset: 30, // set text spacing,default is 40
  quality: 55, // set pic quality,default is 50
  fontsize: 45, // set font size,default is 57
  generate: function () { // Custom the function to generate captcha text
    return rw.random(4)
  }
})

module.exports = {
    RandomWord: RandomWord,
    captcha: captcha
}