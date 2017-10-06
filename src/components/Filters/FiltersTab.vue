<template>
    <div class="tour-tab">
        <div class="tour-tab_header" v-if="header.length" v-on:click="toggleTab();">
            {{header}} <span> {{ active ? '&plus;' : '&minus;' }} </span>
        </div>
        <transition name="slide">
            <div class="tour-tab_filters" v-show="active">

                <div v-if="type === 'name'">
                    <slot name="name"></slot>
                </div>

                <ul class="tour-category-filters" v-if="type === 'category'">
                    <slot name="category"></slot>
                </ul>

                <div v-if="type === 'range'">
                    <slot name="range"></slot>
                </div>

                <ul class="tour-checkbox-filters" v-if="checkboxTab">
                    <slot name="checkbox"></slot>
                </ul>

            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        name: 'filters-tab',
        data() {
            return{
                active: false,
                checkboxTab: true
            }
        },
        props: {
            header: {
                type: String,
                required: false,
                default: ''
            },
            type: {
                type: String,
                required: true
            }
        },
        mounted() {
            if (this.type === 'name' || this.type === 'category' || this.type === 'range') {
                this.active = true;
                this.checkboxTab = false;
            }
        },
        methods: {
            toggleTab() {
                this.active = ! this.active;
            },
//            beforeEnter(el) {
//                el.style.opacity = 0;
//                el.style.height = 0;
//            },
//            enter(el, done) {
//                let delay = el.dataset.index * 150;
//                setTimeout(function () {
//                    Velocity(
//                        el,
//                        { opacity: 1, height: '1.6em' },
//                        { complete: done }
//                    )
//                }, delay)
//            },
//            leave(el, done) {
//                let delay = el.dataset.index * 150;
//                setTimeout(function () {
//                    Velocity(
//                        el,
//                        { opacity: 0, height: 0 },
//                        { complete: done }
//                    )
//                }, delay)
//            }
        }
    }
</script>
<style lang="scss">
    .tour {
        &:hover {
            .filter-tab_header {
                background-color: #276c7b;
            }
        },
        &-tab {
            margin-bottom: 15px;

            &_header {
                position: relative;
                height: 29px;
                padding: 6px 38px 0 18px;
                color: #ffffff;
                font: 14px PTSansBold, sans-serif;
                letter-spacing: 1px;
                text-transform: uppercase;
                background-color: #219d94;
                cursor: pointer;

                span {
                    float: right;
                    font: 32px/0.4 PTSansRegular;
                }
            }
            &_filters {
                padding: 11px 19px 11px 21px
            }

            .text-filter {
                padding: 0 10px;
                border: none;
                height: 28px;
                width: 255px;
                color: #676767;
                font: 16px PTSansRegular, sans-serif;
                outline: none;
            }
        }
        &-category-filters {
            display: flex;
            padding: 7px 0 0;
            margin: 0;
            list-style: none;
            font-size: 14px;
            li {
                padding-top: 20px;
                margin-right: 3px;
                width: 28px;
            }
            label {
                padding: 22px 0 0 7px;
            }
        }
        &-checkbox-filters {
            padding: 7px 0 0;
            margin: 0;
            list-style: none;
            font-size: 14px;
            li {
                padding-bottom: 10px;
            }
            label {
                display: inline-block;
                padding-left: 30px;
                line-height: 1.5;
                &:before {
                    left: 0;
                }
            }
        }
    }
</style>