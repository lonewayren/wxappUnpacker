Component({
    properties: {
        show: Boolean,
        actions: {
            type: Array,
            value: [ {
                key: "shareTimeline",
                name: "分享给好友"
            }, {
                key: "shareMoment",
                name: "生成分享卡片"
            } ]
        }
    },
    data: {},
    methods: {
        close: function() {
            this.triggerEvent("select", "");
        },
        selectAction: function(e) {
            var t = this.data.actions[e.currentTarget.dataset.index].key;
            this.triggerEvent("select", t);
        }
    }
});