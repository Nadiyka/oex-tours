<template>
    <div class="tour-results">
        <div class="tour-controls">
            <pagination :items="tours.length" :current-page="currentPage" :items-per-page="itemsPerPage" @pagination="paginate"></pagination>
            <div class="tour-controls_right">
                <price @changePriceType="changedPriceType"></price>
                <currency></currency>
            </div>
        </div>
        <tours :tours="toursOnPage" :price-type="priceType"> </tours>
        <div class="tour-empty" v-show="!tours.length">
            Нет подходящих туров. Попробуйте уменьшить количество фильтров
        </div>
        <div class="tour-controls">
            <pagination :items="tours.length" :current-page="currentPage" :items-per-page="itemsPerPage" @pagination="paginate"></pagination>
        </div>
    </div>
</template>

<script>
    import Tours from '../../components/Items/Tours.vue';
    import Pagination from '../../components/Pagination/Pagination.vue';
    import Price from '../../components/Price/Price.vue';
    import Currency from '../../components/Price/Currency.vue';
    export default {
        name: 'Results',

        data() {
            return {
                currentPage: 1,
                itemsPerPage: 3,
                toursOnPage: [],
                priceType: 'tourist'
            }
        },
        props: {
            tours: {
                type: Array,
                required: true
            }
        },
        mounted() {
            this.toursOnPage = this.tours.slice(this.currentPage - 1, this.itemsPerPage);
        },
        methods: {
            paginate(page) {
                let startIndex = ((page - 1) * this.itemsPerPage);
                this.currentPage = page;
                this.toursOnPage = this.tours.slice(startIndex, this.itemsPerPage + startIndex);
            },
            changedPriceType(priceType){
                this.priceType = priceType
            }
        },
        watch: {
            tours() {
                this.toursOnPage = this.tours.slice(this.currentPage - 1, this.itemsPerPage);
            }
        },
        components: {
            'tours': Tours,
            'pagination': Pagination,
            'price': Price,
            'currency': Currency
        }
    }
</script>

<style lang="scss">
    .tour-results {
        width: 925px;
    }
    .tour-controls {
        display: flex;
        justify-content: space-between;
        margin: 20px 20px 25px 57px;
        &_right {
            display: flex;
            justify-content: space-between;
            width: 250px;
        }
    }
    .dropdown-menu {
        position: relative;
        padding-right: 20px;
        font-size: 14px;
        cursor: pointer;
        .sort {
            position: absolute;
            top: 7px;
            right: 0;
            display: inline-block;
            color: #df5252;
            font-size: 10px;
        }
        ul {
            z-index: 20;
            position: absolute;
            top: 28px;
            padding: 10px 5px 15px;
            margin-top: 5px;
            width: 100%;
            background-color: #ffffff;
            border: 1px solid #d8d8d8;
            box-shadow: -5px 3px 10px 0 rgba(0, 0, 0, 0.2);
            list-style: none;
            li {
                margin-bottom: 15px;
            }
            .checkbox {
                padding: 5px 0 10px 25px;
                color: #676767;
                line-height: 22px;
                &:before {
                    top: auto;
                    left: 0;
                }
            }
            input:checked ~ .checkbox {
                color: #209d94;
            }
        }
    }
</style>