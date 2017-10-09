<template>
    <div class="tour-tab">
        <div class="tour-tab_header" v-if="header.length" v-on:click="toggleTab();">
            {{header}} <span> {{ showTab ? '&plus;' : '&minus;' }} </span>
            <i class="icon-info icon-info_popular" v-if="special"></i>
        </div>
        <transition @enter="transitionIn" @leave="transitionOut" >
            <div class="tour-tab_filters" v-show="showTab">

                <div v-if="type === 'name'">
                    <slot name="name"></slot>
                </div>

                <ul class="tour-category-filters" v-if="type === 'category'">
                    <slot name="category"></slot>
                </ul>

                <div v-if="type === 'range'">
                    <slot name="range"></slot>
                </div>

                <ul class="tour-checkbox-filters" v-if="type === 'default'">
                    <slot name="checkbox"></slot>
                </ul>

            </div>
        </transition>
    </div>
</template>
<script>
    import Velocity from 'velocity-animate';
    export default {
        name: 'filters-tab',
        data() {
            return{
                showTab: false
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
            },
            active: {
                type: Boolean,
                default: false
            },
            special: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            this.showTab = this.active;
        },
        methods: {
            toggleTab() {
                this.showTab = ! this.showTab;
            },
            transitionIn(el, done) {
                Velocity(el, "stop");
                Velocity(el, "slideDown",{
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: false,
                    complete: done
                })
            },
            transitionOut(el, done) {
                Velocity(el, "stop");
                Velocity(el, "slideUp",{
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: false,
                    complete: done
                })
            }
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