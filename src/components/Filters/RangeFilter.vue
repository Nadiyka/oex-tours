<template>
    <div>
        <div class="slider">
            <vue-slider ref="slider"
                        v-model="range"
                        tooltip="never"
                        :min="filter.minValue"
                        :max="filter.maxValue"
                        :slider-style="sliderStyle"
                        :process-style="processStyle"
                        :bg-style="bgStyle"
                        :real-time="true"
                        @input="rangeFilter"
            >
            </vue-slider>
            <div class="slider_unit">
                {{range[0]}} {{filter.unit}} - {{range[1]}} {{filter.unit}}
            </div>
        </div>
    </div>
</template>
<script>
    import vueSlider from 'vue-slider-component'
    export default {
        name: 'range-filter',
        data() {
            return {
                range: [0, 0],
                step: 0.1,
                sliderStyle: [
                    {
                        position: 'absolute',
                        outline: 'none',
                        cursor: 'pointer',
                        marginLeft: '-.6em',
                        top: '-9px',
                        height: '20px',
                        width: '20px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        background: '-webkit-radial-gradient(circle closest-side, #fff 3px, #df5252 0)',
                        background: 'radial-gradient(circle closest-side, #fff 3px, #df5252 0)',
                        border: '2px solid #f0f0f0',
                        boxShadow: '1px 1px 0 0 #717575'
                    },
                    {
                        position: 'absolute',
                        outline: 'none',
                        cursor: 'pointer',
                        marginLeft: '-.6em',
                        top: '-9px',
                        height: '20px',
                        width: '20px',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        background: '-webkit-radial-gradient(circle closest-side, #fff 3px, #df5252 0)',
                        background: 'radial-gradient(circle closest-side, #fff 3px, #df5252 0)',
                        border: '2px solid #f0f0f0',
                        boxShadow: '1px 1px 0 0 #717575'
                    }
                ],
                processStyle: {
                    position: 'absolute',
                    zIndex: '1',
                    fontSize: '0.7em',
                    display: 'block',
                    border: '0',
                    backgroundPosition: '0 0',
                    borderRadius: '4px',
                    top: '-1px',
                    height: '5px',
                    backgroundImage: '-webkit-linear-gradient(left, #07ca86, #37bff6)',
                    backgroundImage: 'linear-gradient(to right, #07ca86, #37bff6)',
                    cursor: 'pointer'
                },
                bgStyle: {
                    height: '5px',
                    backgroundImage: '-webkit-linear-gradient(#acb0b1, #c1c5c6)',
                    backgroundImage: 'linear-gradient(#acb0b1, #c1c5c6)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }
            }
        },
        props: {
            filter: {
                type: Object,
                required: true
            }
        },
        created() {
            this.range[0] = this.filter.minValue;
            this.range[1] = this.filter.maxValue;
        },
        watch: {
            /*filter: {
                handler(newFilter) {
                    this.range[0] = newFilter.minValue;
                    this.range[1] = newFilter.maxValue;
                },
                deep: true
            },
            range: {
                handler(newRange) {
                    if (newRange) {

                    }
                },
                deep: true
            }*/
        },
        methods:{
            rangeFilter(newRange) {
                console.log(newRange);
              this.$emit('filter', this.filter.type, this.filter.property, {
                  min: newRange[0],
                  max: newRange[1]
              })
          }
        },
        components: {
            vueSlider
        }
    }
</script>
<style lang="scss">
    .slider {
        padding: 19px 0 0 7px;
        outline: none;

        &_unit {
            display: flex;
            justify-content: center;
            padding-top: 7px;
            text-align: center;
            font-size: 14px;
        }
    }
</style>