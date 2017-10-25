<template>
    <input v-model="value" class="text-filter" @keyup="textFilter" v-bind:placeholder="filter.placeholder" />
</template>

<script>
    export default {
        name: 'text-filter',
        data: function () {
            return {
                value: ''
            }
        },
        props: {
            filter: {
                type: Object,
                required: true
            }
        },
        methods: {
            /**
             * Функция запускает фильтр по тексту
             */
            textFilter: function () {
                this.$emit('filter', this.filter.type, {
                    inclusion: this.filter.inclusion,
                    property: this.filter.property,
                }, this.value)
            }
        }
    }
</script>