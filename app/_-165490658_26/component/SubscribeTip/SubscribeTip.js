Component({
    properties: {
        show: Boolean
    },
    data: {},
    methods: {
        hide: function() {
            this.triggerEvent("hide");
        },
        stopPropagation: function() {}
    }
});