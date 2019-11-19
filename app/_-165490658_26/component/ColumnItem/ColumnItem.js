Component({
    properties: {
        data: Object,
        type: String
    },
    data: {},
    methods: {
        jump: function(t) {
            this.triggerEvent("gtap", t.currentTarget.dataset.column);
        }
    }
});