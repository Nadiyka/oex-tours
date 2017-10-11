<template>
    <div id="content">
        <gmap-map
                v-show="results.tours.length"
                :center="mapCenter"
                :zoom="11"
                :options="mapOptions"
                map-type-id="roadmap"
                style="width: 100%; height: 450px"
        >
            <gmap-marker
                    :key="index"
                    v-for="(m, index) in markers"
                    :position="m.position"
                    :clickable="true"
                    :draggable="false"
                    @click="mapCenter=m.position"
            ></gmap-marker>
        </gmap-map>
        <div class="center">
            <status :status="results.status"></status>
            <results ref="results" :tours="filteredTours" v-show="results.tours.length"></results>
            <filters :filterTabs="filterTabs" :tours="results.tours" v-show="results.tours.length" v-on:filtered="filtered"></filters>
        </div>
    </div>
</template>
<script>
import { fakeTours } from './assets/fakeTours.js';

import Results from './components/Results/Results.vue';
import Status from './components/Status/Status.vue';
import Filters from './components/Filters/Filters.vue';

export default {
    data() {
        return {
            results: {
                status: {
                    loading: true,
                    error: false
                },
                tours: fakeTours.results,
                filters: fakeTours.filtersTabs
            },
            filteredTours: [],
            filterTabs: [
                {
                    tabType: 'name',
                    header: '',
                    active: true,
                    filtersInTab: {
                        text: [
                            {
                                type: 'text',
                                label: 'Название отеля',
                                property: 'accommodationHotelName',
                                placeholder: 'Искать отель по названию'
                            }
                        ],
                        checkbox: [
                            {
                                type: 'checkbox',
                                label: 'Мгновенное подтверждение',
                                property: 'accommodationStatus',
                                value: '1'
                            }
                        ]
                    },
                },
                {
                    tabType: 'range',
                    header: 'Расстояние до центра',
                    active: true,
                    filtersInTab: {
                        range: [
                            {
                                type: 'range',
                                label: 'Расстояние до центра',
                                property: 'accommodationDistance',
                                minValue: 0,
                                maxValue: 100,
                                unit: 'км'
                            }
                        ]
                    }
                },
                {
                    tabType: 'category',
                    header: 'Категория',
                    active: true,
                    filtersInTab: {
                        category: [
                            {
                                type: 'category',
                                label: '1*',
                                property: 'accommodationStars',
                                value: 1
                            },
                            {
                                type: 'category',
                                label: '2*',
                                property: 'accommodationStars',
                                value: 2
                            },
                            {
                                type: 'category',
                                label: '3*',
                                property: 'accommodationStars',
                                value: 3
                            },
                            {
                                type: 'category',
                                label: '4*',
                                property: 'accommodationStars',
                                value: 4
                            },
                            {
                                type: 'category',
                                label: '5*',
                                property: 'accommodationStars',
                                value: 5
                            },
                            {
                                type: 'category',
                                label: '-',
                                property: 'accommodationStars',
                                value: 6
                            }

                        ]
                    }
                }
            ],
            markers: [],
            mapCenter: {
                lat: 50.100822,
                lng: 14.068581
            },
            mapOptions: {
                streetViewControl: false,
                zoomControl: true,
                mapTypeControl: true
            }
        }
    },
    methods: {
        filtered(filtered) {
            this.filteredTours = filtered;
            this.markers = [];
            this.filteredTours.forEach((tour)=> {
                this.markers.push({
                    position: {lat: tour.hotelsResult.accommodationLatitude, lng: tour.hotelsResult.accommodationLongitude}
                })
            })
        },
        compareTours(a, b) {
            let ans = 0;
            try {
                ans = a.fullPrice.price - b.fullPrice.price;
            } catch(err) {}
            return ans;
        }
    },
    watch: {
        results: {
            handler: function(newResults){
                this.filteredTours = newResults.tours.slice();
            },
            deep: true
        }
    },
    beforeMount() {
        let minDistance = 9999,
            maxDistance = 0;

        this.results.tours.forEach((el) => {
            el.hotelsResult.accommodationStars = parseInt(el.hotelsResult.accommodationStars);
            el.hotelsResult.accommodationLatitude = parseFloat(el.hotelsResult.accommodationLatitude);
            el.hotelsResult.accommodationLongitude = parseFloat(el.hotelsResult.accommodationLongitude);
            el.hotelsResult.accommodationDistance = parseInt(el.hotelsResult.accommodationDistance);
            // min
            if (el.hotelsResult.accommodationDistance < minDistance) {
                minDistance = el.hotelsResult.accommodationDistance;
            }
            //max
            if (el.hotelsResult.accommodationDistance > maxDistance) {
                maxDistance = el.hotelsResult.accommodationDistance;
            }
        });

        this.filterTabs[1].filtersInTab.range[0].minValue = minDistance;
        this.filterTabs[1].filtersInTab.range[0].maxValue = maxDistance;

        this.results.tours.sort(this.compareTours);
        this.filteredTours = this.results.tours.slice();

        // собираем табы
        this.results.filters.forEach((filterTab)=> {
            let filters = [],
                isPopular =  filterTab.groupId.indexOf('topGroup') !== -1,
                tab;
            filterTab.filters.forEach((filter) => {
                filters.push({
                    type: 'checkbox',
                    label: filter.titleRu ? filter.titleRu : filter.titleEn,
                    property: 'accommodationFacts',
                    value: filter.id,
                    double: isPopular
                })
            });
            tab = {
                tabType: 'default',
                header: filterTab.name,
                active: false,
                special: isPopular,
                filtersInTab: {
                    checkbox: filters
                }
            };
            if (isPopular) {
                this.filterTabs.splice(3, 0, tab);
            } else {
                this.filterTabs.push(tab);
            }
        })

    },
    components: {
        Results,
        Status,
        Filters
    }
}
</script>

<style>
    .center {
        position: relative;
        width: 1280px;
        margin-left: auto;
        margin-right: auto;
        padding-left: 20px;
        padding-right: 20px;
        font-size: 16px;
        font-family: PTSansRegular, sans-serif;
    }
    #content .center {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        align-items: flex-start;
        min-height: 400px;
        padding-bottom: 30px;
        color: #333;
    }
    * {
        box-sizing: border-box;
    }

    [class^="icon-"], [class*=" icon-"] {
        /* use !important to prevent issues with browser extensions that change fonts */
        font-family: 'onex-icons' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale; }

    @font-face {
        font-family: 'onex-icons';
        src:  url('./assets/onex-icons/onex-icons.eot?c3fnk');
        src:  url('./assets/onex-icons/onex-icons.eot?c3fnk#iefix') format('embedded-opentype'), url('./assets/onex-icons/onex-icons.ttf?c3fnk') format('truetype'), url('./assets/onex-icons/onex-icons.woff?c3fnk') format('woff'), url('./assets/onex-icons/onex-icons.svg?c3fnk#onex-icons') format('svg');
        font-weight: normal;
        font-style: normal;
    }
    /* font-family: "PTSansRegular"; */
    @font-face {
        font-family: "PTSansRegular";
        src: url("./assets/PTSansRegular/PTSansRegular.eot");
        src: url("./assets/PTSansRegular/PTSansRegular.eot?#iefix") format("embedded-opentype"), url("./assets/PTSansRegular/PTSansRegular.woff") format("woff"), url("./assets/PTSansRegular/PTSansRegular.ttf") format("truetype");
        font-style: normal;
        font-weight: normal;
    }
    /* font-family: "PTSansBold"; */
    @font-face {
        font-family: "PTSansBold";
        src: url("./assets/PTSansBold/PTSansBold.eot");
        src: url("./assets/PTSansBold/PTSansBold.eot?#iefix") format("embedded-opentype"), url("./assets/PTSansBold/PTSansBold.woff") format("woff"), url("./assets/PTSansBold/PTSansBold.ttf") format("truetype");
        font-style: normal;
        font-weight: normal;
    }
    /* font-family: "Ubuntu-Bold"; */
    @font-face {
        font-family: "Ubuntu-Bold";
        src: url("./assets/Ubuntu/Ubuntu-Bold/Ubuntu-Bold.woff") format("woff"), url("./assets/Ubuntu/Ubuntu-Bold/Ubuntu-Bold.ttf") format("truetype"), url("./assets/Ubuntu/Ubuntu-Bold/Ubuntu-Bold.eot?#iefix") format("embedded-opentype");
        font-weight: normal;
        font-style: normal;
    }
    .icon-tour:before {
        content: "\e953";
    }
    .icon-hotel:before {
        content: "\e910";
    }
    .icon-plane:before {
        content: "\e918";
    }
    .icon-star:before {
        content: "\e91c";
    }
    .icon-marker:before {
        content: "\e913";
    }
    .icon-exclamation-circled-inversed:before {
        content: "\e92f";
    }
    .icon-arrow:before {
        content: "\e901";
    }
    .icon-info_popular:before {
        content: "\0021";
    }


    .btn {
        position: relative;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -moz-align-items: center;
        -ms-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 6px 12px;
        margin-bottom: 0;
        font-weight: 400;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        border: 0;
        outline: 0;
        text-align: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border-radius: 0.5rem;
        box-shadow: 0 1px 4px -1px #000000;
    }

    input[type=checkbox] {
        display: none;
    }
    input:checked ~ .checkbox:before {
        background: url("./assets/check.png") #fff no-repeat 50%;
    }
    .checkbox {
        position: relative;
        cursor: pointer;
    }
    .checkbox:before {
        position: absolute;
        top: 0;
        content: "";
        width: 19px;
        height: 19px;
        color: #df5252;
        background-color: #fff;
        border: 1px solid #d8d8d8;
        border-radius: 1px;
    }
    .icon-info_popular {
        position: relative;
        display: inline-block;
        padding-top: 1px;
        height: 14px;
        width: 15px;
        font-size: 11px;
        text-align: center;
        border-radius: 50%;
        background-color: #df5252;
        color: #fff;
    }
    .tour-tab_header .icon-info_popular {
        position: absolute;
        top: 8px;
        margin-left: 10px;
    }
</style>
