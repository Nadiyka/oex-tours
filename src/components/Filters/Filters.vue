<template>
    <div class="tour-aside">
        <filters-tab v-for="(tab ,index) in filterTabs" :type="tab.tabType" :header="tab.header" :active="tab.active" :special="tab.special" :key="index">

            <text-filter v-for="textFilter in tab.filtersInTab.text" :filter="textFilter" v-on:filter="filter" slot="name" :key="textFilter.label"></text-filter>
            <ul class="tour-checkbox-filters" slot="name">
                <checkbox-filter v-for="checkboxFilter in tab.filtersInTab.checkbox" :filter="checkboxFilter" v-on:filter="filter" :key="checkboxFilter.label"></checkbox-filter>
            </ul>

            <category-filter v-for="categoryFilter in tab.filtersInTab.category" :filter="categoryFilter" v-on:filter="filter" slot="category" :force-all="forceAll" :key="categoryFilter.label"></category-filter>

            <all-category-filter :all-checked="allChecked" slot="category" @checkCategories="doForceCheck"></all-category-filter>

            <range-filter v-for="rangeFilter in tab.filtersInTab.range" :filter="rangeFilter" v-on:filter="filter" slot="range" :key="rangeFilter.label"></range-filter>

            <checkbox-filter v-for="checkboxFilter in tab.filtersInTab.checkbox" :filter="checkboxFilter" v-on:filter="filter" slot="checkbox"  :key="checkboxFilter.label">
                <ul></ul>
            </checkbox-filter>

        </filters-tab>
    </div>
</template>

<script>
    import FiltersTab from './FiltersTab.vue';
    import CategoryFilter from './CategoryFilter.vue';
    import AllCatFilter from './AllCatFilter.vue';
    import TextFilter from './TextFilter.vue';
    import RangeFilter from './RangeFilter.vue';
    import CheckboxFilter from './CheckboxFilter.vue';
    export default {
        name: 'Filters',
        data() {
            return {
                filtersFunction: {
                    /**
                     * Функция фильтрует по тексту
                     * @param {Object[]} array
                     * @param {string} property
                     * @param {string} value
                     *
                     * @returns {Object[]}
                     */
                    text(array, property, value) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (element.hotelsResult[property] && element.hotelsResult[property].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    /**
                     * Функция фильтрует по тексту
                     * @param {Object[]} array
                     * @param {string} property
                     * @param {Array} values
                     *
                     * @returns {Object[]}
                     */
                    category(array, property, values) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (!values.length || element.hotelsResult[property] && values.indexOf(element.hotelsResult[property]) !== -1) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    /**
                     * Функция фильтрует по тексту
                     * @param {Object[]} array
                     * @param {string} property
                     * @param {Array} values
                     *
                     * @returns {Object[]}
                     */
                    range(array, property, values) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (element.hotelsResult[property] && (element.hotelsResult[property] >= values.min && element.hotelsResult[property] <= values.max)) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    /**
                     * Функция фильтрует по тексту
                     * @param {Object[]} array
                     * @param {string} property
                     * @param {Array} values
                     *
                     * @returns {Object[]}
                     */
                    checkbox(array, property, values) {
                        let filtered = [];
                        array.forEach(function (element) {

                            if (!values.length) {
                                filtered.push(element);
                                return;
                            }
                            if (!element.hotelsResult[property] || values.length > element.hotelsResult[property].length) {
                                return;
                            }

                            let hasAllCriteria = true;
                            values.forEach((value) => {
                                hasAllCriteria = element.hotelsResult[property].indexOf(value) !== -1;
                            });
                            if (hasAllCriteria) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                },
                activeFilters: {
                    text: {},
                    category: {},
                    range: {},
                    checkbox: {}
                },
                filterTypes: [
                    'text',
                    'category',
                    'range',
                    'checkbox'
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
                type: Array,
                required: true
            },
            tours: {
                type: Array,
                required: true
            }
        },
        methods: {
            /**
             * Функция добавляет новый активный фильтр, и запускает фильтрацию
             * @param {string} type
             * @param {string} property
             * @param {string|Array} value
             * @param {boolean} [active]
             */
            filter(type, property, value, active) {
                let filteredResults = this.tours.slice();
                if (this.filterTypes.indexOf(type) !== -1) {
                    this[type + 'AddFilter'](property, value, active);
                    filteredResults = this.applyFilters(filteredResults);
                }
                this.$emit('filtered', filteredResults);
            },
            /**
             * Функция применяет все фильтры к турам
             * @param {Object[]} tours
             *
             * @returns {Object[]}
             */
            applyFilters(tours) {
                for (let filterType in this.activeFilters) {
                    for (let filterProperty in this.activeFilters[filterType]) {
                        tours = this.filtersFunction[filterType](tours, filterProperty, this.activeFilters[filterType][filterProperty])
                    }
                }
                return tours;
            },
            /**
             * Функция добавляет фильтр по тексту
             * @param {string} property
             * @param {string} value
             */
            textAddFilter(property, value) {
                this.activeFilters.text[property] = value;
            },
            /**
             * Функция добавляет фильтр категории
             * @param {string} property
             * @param {string} value
             * @param {boolean} active
             */
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
            /**
             * Функция добавляет фильтр категории
             * @param {string} property
             * @param {Array} range
             */
            rangeAddFilter(property, range) {
                this.activeFilters.range[property] = range;
            },
            /**
             * Функция добавляет фильтр по чекбоксу
             * @param {string} property
             * @param {string} value
             * @param {boolean} active
             */
            checkboxAddFilter(property, value, active) {
                let currentPosition;
                if (this.activeFilters.checkbox[property]) {
                    currentPosition = this.activeFilters.checkbox[property].indexOf(value);
                } else {
                    this.activeFilters.checkbox[property] = [];
                    currentPosition = -1;
                }
                if ( active && (currentPosition === -1 || currentPosition === undefined) ) {
                    this.activeFilters.checkbox[property].push(value);
                }
                if ( !active && currentPosition !== -1 ) {
                    this.activeFilters.checkbox[property].splice(currentPosition, 1);
                }
            },
            /**
             * Функция отмечает все категории
             * @param {boolean} check
             */
            doForceCheck(check) {
                this.forceAll.run++;
                this.forceAll.check = check;
            },
            /**
             * Функция проверяет, отмечены ли все категории
             * @param {string} property
             */
            checkAllCategories(property) {
                if (this.activeFilters.category[property] && this.filterTabs[2].filtersInTab.category.length === this.activeFilters.category[property].length) {
                    this.allChecked = true;
                } else {
                    this.allChecked = false;
                }
            }
        },
        components: {
            CheckboxFilter,
            'filters-tab': FiltersTab,
            'category-filter': CategoryFilter,
            'all-category-filter' : AllCatFilter,
            'text-filter': TextFilter,
            'range-filter': RangeFilter,
            'checkbox-filter': CheckboxFilter
        }
    }
</script>

<style lang="scss">
    .tour {
        &-aside {
            padding: 35px 0 30px;
            margin-top: 25px;
            width: 295px;
            background-color: #dce3e4;
            box-shadow: -5px 3px 10px 0 rgba(0, 0, 0, 0.2);
        }
    }
</style>