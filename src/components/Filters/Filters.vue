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
                     * @param {Object} field
                     * @param {string} value
                     *
                     * @returns {Object[]}
                     */
                    text(array, field, value) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (element[field.inclusion][field.property] && element[field.inclusion][field.property].toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    /**
                     * Функция фильтрует по тексту
                     * @param {Object[]} array
                     * @param {Object} field
                     * @param {Array} values
                     *
                     * @returns {Object[]}
                     */
                    category(array, field, values) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (!values.length || element[field.inclusion][field.property] && values.indexOf(element[field.inclusion][field.property]) !== -1) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    /**
                     * Функция фильтрует по тексту
                     * @param {Object[]} array
                     * @param {Object} field
                     * @param {Array} values
                     *
                     * @returns {Object[]}
                     */
                    range(array, field, values) {
                        let filtered = [];
                        array.forEach(function (element) {
                            if (element[field.inclusion][field.property] && (element[field.inclusion][field.property] >= values.min && element[field.inclusion][field.property] <= values.max)) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                    /**
                     * Функция фильтрует по тексту
                     * @param {Object[]} array
                     * @param {Object} field
                     * @param {Array} values
                     *
                     * @returns {Object[]}
                     */
                    checkbox(array, field, values) {
                        let filtered = [];
                        array.forEach(function (element) {

                            if (!values.length) {
                                filtered.push(element);
                                return;
                            }
                            if (!element[field.inclusion][field.property] || values.length > element[field.inclusion][field.property].length) {
                                return;
                            }

                            let hasAllCriteria = true;
                            values.forEach((value) => {
                                hasAllCriteria = element[field.inclusion][field.property].indexOf(value) !== -1;
                            });
                            if (hasAllCriteria) {
                                filtered.push(element);
                            }
                        });
                        return filtered;
                    },
                },
                activeFilters: {
                    hotelsResult: {},
                    aviaResult: {}
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
        created() {
            //типы фильтров
            for (let filter in this.filterTypes) {
                if (typeof this.filtersFunction[this.filterTypes[filter]] === 'function'){
                    for (let resultPart in this.activeFilters) {
                        this.activeFilters[resultPart][this.filterTypes[filter]] = {}
                    }
                }
            }
        },
        methods: {
            /**
             * Функция добавляет новый активный фильтр, и запускает фильтрацию
             * @param {string} type
             * @param {Object} field
             * @param {string|Array} value
             * @param {boolean} [active]
             */
            filter(type, field, value, active) {
                let filteredResults = this.tours.slice();
                if (this.filterTypes.indexOf(type) !== -1) {
                    this[type + 'AddFilter'](field, value, active);
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
                try {
                    for (let resultPart in this.activeFilters) {
                        for (let filterType in this.activeFilters[resultPart]) {
                            for (let filterProperty in this.activeFilters[resultPart][filterType]) {
                                tours = this.filtersFunction[filterType](tours, {
                                    inclusion: resultPart,
                                    property: filterProperty
                                }, this.activeFilters[resultPart][filterType][filterProperty])
                            }
                        }
                    }
                }  catch (err) {
                    console.log('Не удалось применить фильтры', err);
                }
                return tours;
            },
            /**
             * Функция добавляет фильтр по тексту
             * @param {Object} field
             * @param {string} value
             */
            textAddFilter(field, value) {
                this.activeFilters[field.inclusion].text[field.property] = value;
            },
            /**
             * Функция добавляет фильтр категории
             * @param {Object} field
             * @param {string} value
             * @param {boolean} active
             */
            categoryAddFilter(field, value, active) {
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
                    if (self.activeFilters[field.inclusion].category[field.property]) {
                        currentPosition = self.activeFilters[field.inclusion].category[field.property].indexOf(value);
                    } else {
                        self.activeFilters[field.inclusion].category[field.property] = [];
                        currentPosition = -1;
                    }
                    if ( active && (currentPosition === -1 || currentPosition === undefined) ) {
                        self.activeFilters[field.inclusion].category[field.property].push(value);
                    }
                    if ( !active && currentPosition !== -1 ) {
                        self.activeFilters[field.inclusion].category[field.property].splice(currentPosition, 1);
                    }
                }
                this.checkAllCategories(field)
            },
            /**
             * Функция добавляет фильтр категории
             * @param {Object} field
             * @param {Array} range
             */
            rangeAddFilter(field, range) {
                this.activeFilters[field.inclusion].range[field.property] = range;
            },
            /**
             * Функция добавляет фильтр по чекбоксу
             * @param {Object} field
             * @param {string} value
             * @param {boolean} active
             */
            checkboxAddFilter(field, value, active) {
                let currentPosition;
                if (this.activeFilters[field.inclusion].checkbox[field.property]) {
                    currentPosition = this.activeFilters[field.inclusion].checkbox[field.property].indexOf(value);
                } else {
                    this.activeFilters[field.inclusion].checkbox[field.property] = [];
                    currentPosition = -1;
                }
                if ( active && (currentPosition === -1 || currentPosition === undefined) ) {
                    this.activeFilters[field.inclusion].checkbox[field.property].push(value);
                }
                if ( !active && currentPosition !== -1 ) {
                    this.activeFilters[field.inclusion].checkbox[field.property].splice(currentPosition, 1);
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
             * @param {Object} field
             */
            checkAllCategories(field) {
                if (this.activeFilters[field.inclusion].category[field.property] && this.filterTabs[2].filtersInTab.category.length === this.activeFilters[field.inclusion].category[field.property].length) {
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