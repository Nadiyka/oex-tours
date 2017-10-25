<template>
    <div class="tour-list" v-show="tours.length">
        <tour v-for="tour in tours" :tour="tour" :priceType="priceType" :key="tour.tourId"></tour>
    </div>
</template>
<script>
    import Tour from './Tour.vue';
    export default {
        name: 'Tours',
        data: function () {
            return {}
        },
        props: {
            tours: {
                type: Array,
                required: true
            },
            priceType: {
                type: String,
                required: true
            }
        },
        components: {
            Tour
        }
    }
</script>

<style lang="scss">
    .tour-list {
        border: 1px solid #d8d8d8;
        border-bottom: none;
    }
</style>