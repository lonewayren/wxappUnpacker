Component({
    properties: {
        data: Object
    },
    data: {},
    methods: {
        go: function() {
            wx.navigateTo({
                url: "/pages/vplayer/vplayer"
            });
        }
    }
});