<template>
    <div class="tour-aside">
        <filters-tab v-for="(tab, type) in filterTabs" :type="type" :header="tab.header" v-on:filter="filter">

            <text-filter v-for="textFilter in tab.filtersInTab.text" :filter="textFilter" v-on:filter="filter" slot="name"></text-filter>

            <category-filter v-for="categoryFilter in tab.filtersInTab.category" :filter="categoryFilter" v-on:filter="filter" slot="category" :force-all="forceAll"></category-filter>

            <all-category-filter :all-checked="allChecked" slot="category" @checkCategories="doForceCheck"></all-category-filter>

            <range-filter v-for="rangeFilter in tab.filtersInTab.range" :filter="rangeFilter" v-on:filter="filter" slot="range" ></range-filter>

        </filters-tab>
    </div>
</template>

<script>
    import FiltersTab from './FiltersTab.vue';
    import CategoryFilter from './CategoryFilter.vue';
    import AllCatFilter from './AllCatFilter.vue';
    import TextFilter from './TextFilter.vue';
    import RangeFilter from './RangeFilter.vue';
    export default {
        name: 'Filters',
        data() {
            return {
                filtersFunction: {
                    text(array, property, value) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (element[property] && element[property].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    category(array, property, values) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (!values.length || element[property] && values.indexOf(element[property]) !== -1) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    range(array, property, values) {
                        let filtered = [];
                        array.forEach(function (element) {
                            console.log(element.accommodationHotelName, element[property]);
                            if (element[property] && (element[property] >= values.min && element[property] <= values.max)) {
                                filtered.push(element);
                                console.log(element.accommodationHotelName, element[property]);
                            }
                        });
                        return filtered;
                    }
                },
                activeFilters: {
                    text: {},
                    category: {},
                    range: {}
                },
                filterTypes: [
                    'text',
                    'category',
                    'range'
                ],
                allChecked: false,
                forceAll: {
                    run: 0,
                    check: true
                }
            }
        },
        props: {
            filterTabs: {
                type: Object,
                required: true
            },
            tours: {
                type: Array,
                required: true
            }
        },
        methods: {
            filter(type, property, value, active) {
                let filteredResults = this.tours.slice();
                if (this.filterTypes.indexOf(type) !== -1) {
                    this[type + 'AddFilter'](property, value, active);
                    filteredResults = this.applyFilters(filteredResults);
                }
                this.$emit('filtered', filteredResults);
            },
            applyFilters(tours) {
                for (let filterType in this.activeFilters) {
                    for (let filterProperty in this.activeFilters[filterType]) {
                        tours = this.filtersFunction[filterType](tours, filterProperty, this.activeFilters[filterType][filterProperty])
                    }
                }
                return tours;
            },
            textAddFilter(property, value) {
                this.activeFilters.text[property] = value;
            },
            categoryAddFilter(property, value, active) {
                let self = this;
                if (value === 'all') {
                    let categories = [1, 2, 3, 4, 5, 6];
                    categories.forEach((el) => {
                        addCategory(el, active);
                    });
                } else {
                    addCategory(value, active);
                }

                function addCategory(value, active) {
                    let currentPosition;
                    if (self.activeFilters.category[property]) {
                        currentPosition = self.activeFilters.category[property].indexOf(value);
                    } else {
                        self.activeFilters.category[property] = [];
                        currentPosition = -1;
                    }
                    if ( active && (currentPosition === -1 || currentPosition === undefined) ) {
                        self.activeFilters.category[property].push(value);
                    }
                    if ( !active && currentPosition !== -1 ) {
                        self.activeFilters.category[property].splice(currentPosition, 1);
                    }
                }
                this.checkAllCategories(property)
            },
            rangeAddFilter(property, range) {
                this.activeFilters.range[property] = range;
            },
            doForceCheck(check) {
                this.forceAll.run++;
                this.forceAll.check = check;
            },
            checkAllCategories(property) {
                if (this.activeFilters.category[property] && this.filterTabs.category.filtersInTab.category.length === this.activeFilters.category[property].length) {
                    this.allChecked = true;
                } else {
                    this.allChecked = false;
                }
            }
        },
        components: {
            'filters-tab': FiltersTab,
            'category-filter': CategoryFilter,
            'all-category-filter' : AllCatFilter,
            'text-filter': TextFilter,
            'range-filter': RangeFilter
        }
    }
</script>

<style lang="scss">
    .tour {
        &-aside {
            padding: 5px 0 30px;
            width: 295px;
            background-color: #dce3e4;
            box-shadow: -5px 3px 10px 0 rgba(0, 0, 0, 0.2);
        }
    }
</style>