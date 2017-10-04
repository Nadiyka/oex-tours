<template>
    <div class="results-loading" v-show="status.loading || status.error">
        <img src="/themes/newTheme/img/preloaders/preloader-thin.gif" alt="" v-show="status.loading">
        <span v-show="status.error"> Ошибка получения результатов поиска! Обратитесь к администратору. </span>
    </div>
</template>

<script>
    export default {
        name: 'status',
        data() {
            return {}
        },
        props: {
            status: {
                type: Object,
                required: true
            }
        }
    }
</script>