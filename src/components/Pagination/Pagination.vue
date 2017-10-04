<template>
    <div class="pagination">
        <ul>
            <li class="pagination_to-first" v-show="minPage > 1" @click="goToPage(1)">
                <<
            </li>
            <li class="pagination_to-prev" v-show="minPage > 1" @click="goToPage(currentPage - 1)">
                <
            </li>
            <li v-bind:class="{'pagination_page-active': currentPage==pageNumber}"
                class="pagination_page"
                v-for="pageNumber in pages"
                @click="goToPage(pageNumber)"
                v-show="pageNumber >= minPage && pageNumber <= maxPage"
            >
                {{pageNumber}}
            </li>
            <li class="pagination_to-next"  v-show="maxPage < pages" @click="goToPage(currentPage + 1)">
                >
            </li>
            <li class="pagination_to-last" v-show="maxPage < pages" @click="goToPage(pages)">
                >>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'pagination',
        data() {
          return {
              showPages: 5,
              minPage: 1,
              maxPage: 1,
              pages: 1,
              oldCurrentPage: 1
          }
        },
        props: {
            items: {
                type: Number,
                required: true
            },
            currentPage: {
                type: Number,
                required: true
            },
            itemsPerPage: {
                type: Number,
                required: true,
                default: 1
            }
        },
        mounted() {
            this.pages = Math.ceil(this.items / this.itemsPerPage);
            if (this.showPages <= 1) {
                return;
            }
            for (let page = 2; page <= this.showPages && this.maxPage <= this.pages; page ++ ) {
                this.maxPage = page
            }
        },
        methods: {
            goToPage(page) {
                this.oldCurrentPage = this.currentPage;
                this.$emit('pagination', page)
            },
            goToFirstPage() {
                if (this.minPage !== 1) {
                    this.minPage = 1;
                    this.maxPage = 1;
                    for (let page = 2; page <= this.showPages && this.maxPage <= this.pages; page ++ ) {
                        this.maxPage = page
                    }
                }
            },
            goToLastPage() {
                if (this.maxPage !== this.pages) {
                    this.maxPage = this.pages;
                    this.minPage = this.pages;
                    for (let page = 1 ; page < this.showPages && this.minPage > 1; page ++ ) {
                        this.minPage--;
                    }
                }
            },
            goToPrevPage(newPage) {
                if (newPage < this.minPage ) {
                    this.maxPage = newPage;
                    this.minPage = newPage;
                    for (let page = 1 ; page < this.showPages && this.minPage > 1; page ++ ) {
                        this.minPage--;
                    }
                }
            },
            goToNextPage(newPage) {
                if (newPage > this.maxPage ) {
                    this.maxPage = newPage;
                    this.minPage = newPage;
                    for (let page = 1 ; page < this.showPages && this.maxPage < this.pages; page ++ ) {
                        this.maxPage++;
                    }
                }
            }
        },
        watch: {
            currentPage(value) {
                if (value === 1) {
                    this.goToFirstPage();
                    return;
                }
                if (value === this.pages) {
                    this.goToLastPage();
                    return;
                }
                if (value > this.oldCurrentPage) {
                    this.goToNextPage(value);
                }
                if (value < this.oldCurrentPage) {
                    this.goToPrevPage(value);
                }
            },
            items(value) {
                let newPage = this.currentPage ? this.currentPage : 1;
                this.pages = Math.ceil(value / this.itemsPerPage);
                while (newPage > this.pages) {
                    newPage--;
                }
                this.goToPage(newPage)
            }
        }
    }
</script>

<style lang="scss">
    .navigate-page {
        padding: 0;
        min-width: 1rem;
        color: #ff3800;
        font-family: PTSansBold, sans-serif;
        font-weight: 500;
        background-color: transparent;
        border: none;
        -webkit-box-shadow: none;
        box-shadow: none;

        &:hover {
            color: #b32700;
            background: transparent;
        }
    }
    .pagination {
        ul {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            margin: 0;
            padding: 0;
            color: #2abb9b;
            list-style: none;
            font-size: 14px;
            li {
                cursor: pointer;
            }
        }
        &_page {
            padding: 0;
            margin-right: 6px;
            height: 20px;
            min-width: 1.2rem;
            text-align: center;
            background-color: transparent;
            border: 1px solid #8e8e8e;
            -webkit-box-shadow: 0 0 1px 1px rgba(142, 142, 142, 0.35);
            box-shadow: 0 0 1px 1px rgba(142, 142, 142, 0.35);

            &:hover {
                color: #fff;
                background: #2abb9b;
            }
            &-active {
                color: #fff;
                background-color: #2abb9b;
            }
        }
        &_to-first {
            @extend .navigate-page;
            margin-right: 5px;
        }
        &_to-prev {
            @extend .navigate-page;
        }
        &_to-last {
            @extend .navigate-page;
        }
        &_to-next {
            @extend .navigate-page;
        }
    }
</style>