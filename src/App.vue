<template>
    <div id="content">
        <gmap-map
                id="map"
                v-if="results.tours.length"
                :center="map.center"
                :zoom="11"
                :options="map.options"
                map-type-id="roadmap"
                style="width: 100%; height: 450px"
        >
            <gmap-cluster>
                <gmap-marker
                        v-for="(m, index) in map.markers"
                        :position="m.position"
                        :clickable="true"
                        :draggable="false"
                        :key="index"
                        :icon="map.icon"
                        @click="showHotelOnMap(m.position, m.tour)"
                ></gmap-marker>
            </gmap-cluster>
            <gmap-info-window
                    v-if="infowindow.tour !== null"
                    :opened="infowindow.opened"
                    :position="infowindow.position"
                    :options="infowindow.options"
                    @closeclick="infowindow.opened=false"
            >
                <div class="tour-infowindow">
                    <div class="tour-infowindow_image">
                        <img :src="infowindow.tour.hotelsResult.picture" alt="Отель">
                    </div>
                    <div class="tour-infowindow_info">
                        <div class="tour-infowindow_category">
                            <i class="icon-star" v-for="star in infowindow.tour.hotelsResult.accommodationStars"></i>
                        </div>
                        <div class="tour-infowindow_name">
                            {{infowindow.tour.hotelsResult.accommodationHotelName}}
                        </div>
                    </div>
                    <div class="tour-infowindow_price">
                        от
                        <span class="total-price">{{Math.ceil(infowindow.tour.fullPrice.price)}}</span>
                        <span class="currency">{{infowindow.tour.fullPrice.currency}}</span>
                    </div>
                </div>
            </gmap-info-window>
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
import { bus } from './bus.js';

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
                info: {},
                tours: [],
                filters: []
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
                                value: 1,
                                initActive: false
                            },
                            {
                                type: 'category',
                                label: '2*',
                                property: 'accommodationStars',
                                value: 2,
                                initActive: false
                            },
                            {
                                type: 'category',
                                label: '3*',
                                property: 'accommodationStars',
                                value: 3,
                                initActive: false
                            },
                            {
                                type: 'category',
                                label: '4*',
                                property: 'accommodationStars',
                                value: 4,
                                initActive: false
                            },
                            {
                                type: 'category',
                                label: '5*',
                                property: 'accommodationStars',
                                value: 5,
                                initActive: false
                            },
                            {
                                type: 'category',
                                label: '-',
                                property: 'accommodationStars',
                                value: 6,
                                initActive: true
                            }

                        ]
                    }
                }
            ],
            map: {
                markers: [],
                center: {
                    lat: 50.100822,
                    lng: 14.068581
                },
                options: {
                    streetViewControl: false,
                    zoomControl: true,
                    mapTypeControl: true
                },
                icon: {
                    url: '/src/assets/red_marker.png',
                }
            },
            infowindow: {
                opened: false,
                position: {},
                tour: null,
                options: {
                    pixelOffset: {
                        height: -35,
                        width:0
                    }
                }
            }
        }
    },
    methods: {
        filtered(filtered) {
            this.filteredTours = filtered;
            this.map.markers = [];
            this.filteredTours.forEach((tour)=> {
                if (tour.hotelsResult.accommodationLatitude && tour.hotelsResult.accommodationLongitude) {
                    this.map.markers.push({
                        position: {
                            lat: tour.hotelsResult.accommodationLatitude,
                            lng: tour.hotelsResult.accommodationLongitude,
                        },
                        tour: tour
                    })
                }
            })
        },
        compareTours(a, b) {
            let ans = 0;
            try {
                ans = a.fullPrice.price - b.fullPrice.price;
            } catch(err) {}
            return ans;
        },
        showHotelOnMap(params, tour) {
            this.map.center = params;
            this.infowindow.position = params;
            this.infowindow.opened = true;
            this.infowindow.tour = tour;
        },
        initAll() {
            let minDistance = 9999,
                maxDistance = 0;
            this.results.tours.forEach((el) => {
                el.hotelsResult.accommodationStars = parseInt(el.hotelsResult.accommodationStars);
                if (el.hotelsResult.accommodationLongitude && el.hotelsResult.accommodationLatitude) {
                    el.hotelsResult.accommodationLatitude = parseFloat(el.hotelsResult.accommodationLatitude);
                    el.hotelsResult.accommodationLongitude = parseFloat(el.hotelsResult.accommodationLongitude);
                }
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
            });

            //отмечаем нужные категории
            this.results.info.filterHotelFilterHotelTypeList.forEach((activeCategory)=> {
                activeCategory = parseInt(activeCategory);

                this.filterTabs[2].filtersInTab.category[activeCategory - 1].initActive = true;
            });
        },
    },
    watch: {
        results: {
            handler: function(newResults){
                this.filteredTours = newResults.tours.slice();
            },
            deep: true
        }
    },
    created() {
        let self = this;
        try {
            $.ajax({
                'cache': false,
                'dataType': 'json',
                'success': function(data) {
                    self.results.status.loading = false;
                    self.results.tours = data.results;
                    self.results.filters = data.filtersTabs;
                    self.results.info= data.search_info;
                    console.log('Р-ты', data);
                    self.initAll();
                },
                'error': function(err) {
                    self.results.status.error = false;
                    self.results.status.loading = false;
                    self.results.tours = fakeTours.results;
                    self.results.filters = fakeTours.filtersTabs;
                    self.results.info= fakeTours.search_info;
                    self.initAll();
                    console.log('Ошибка:', err.responseText);
                }
            });
        } catch (err) {
            self.results.status.error = false;
            self.results.status.loading = false;
            self.results.tours = fakeTours.results;
            self.results.filters = fakeTours.filtersTabs;
            self.results.info= fakeTours.search_info;
            self.initAll();
        }
        bus.$on('showHotelOnMap', this.showHotelOnMap)
    },
    components: {
        Results,
        Status,
        Filters
    }
}
</script>

<style lang="scss">
    $yellow-color: #eed664;
    $blue-color: #1a6089;

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

    .tour-infowindow {
        display: flex;
        justify-content: space-between;
        width: 650px;
        &_image {
            align-self: center;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 200px;
            width: 260px;
            overflow: hidden;
            img {
                height: auto;
                width: 100%;
            }
        }
        &_info {
            width: 160px;
        }
        &_category {
            color: $yellow-color;
            font-size: 10px;
            i {
                margin-right: 4px;
            }
        }
        &_name {
            color: $blue-color;
            font: 24px PTSansBold, sans-serif;
            text-decoration: underline;
        }
        &_price {
            align-self: center;
            color: #000;
            font-size: 24px;
            .total-price {
                font: 36px PTSansBold, sans-serif;
                white-space: nowrap;
            }
            .currency {
                font-family: PTSansBold, sans-serif;
                text-transform: uppercase;
            }
        }
    }
</style>
