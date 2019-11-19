module.exports = {
    checkNickname: function(t) {
        return !!/^[^'"&<>]{1,16}$/.test(t);
    },
    checkMobile: function(t, e) {
        return 86 === e ? !!/^1[1-9]\d{9}$/.test(t) : !!/^[\d]{5,11}$/.test(t);
    },
    checkCaptcha: function(t) {
        return !!/^\d{6}$/.test(t);
    },
    checkImgCaptcha: function(t) {
        return !!/^.{4}$/.test(t);
    },
    checkPassword: function(t) {
        return !!/^.{6,24}$/.test(t);
    }
};