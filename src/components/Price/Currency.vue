<template>
    <div class="dropdown-menu" @click="toggleMenu" v-on-clickaway="closeMenu">
        Валюта: {{currency}}
        <div class="sort">
            <i class="icon-arrow"></i>
        </div>
        <ul v-show="showMenu">
            <li v-for="cur in currencyList">
                <input style="display:none" :id="cur + 'Tours'" type="radio" :value="cur" v-model="currency" @click="changeCurrency">
                <label class="checkbox" :for="cur + 'Tours'">{{cur}}</label>
            </li>
        </ul>
    </div>
</template>
<script>
    import { directive as onClickaway } from 'vue-clickaway';
    export default {
        name: 'price',
        data() {
            return {
                currency: 'RUB',
                showMenu: false,
                currencyList: []
            }
        },
        methods: {
            /**
             * Функция меняет валюту
             */
            changeCurrency() {
                $.ajax({
                    url: '/site/currency/?currency=' + this.currency,
                    success: () => {
                        location.reload();
                    }
                });
            },
            /**
             * Функция показывает/скрывает меню
             */
            toggleMenu() {
                this.showMenu = !this.showMenu;
            },
            /**
             * Функция скрывает меню
             */
            closeMenu() {
                this.showMenu = false;
            }
        },
        beforeMount() {
            try {
                let currencies = JSON.parse(localStorage.getItem('oex-currency'));
                currencies.forEach((cur) => {
                    this.currencyList.push(cur.name);
                    this.currency = cur.active ? cur.name : this.currency;
                });
            } catch (err) {
                console.log(err);
            }
        },
        directives: {
            onClickaway: onClickaway,
        }
    }
</script>
<style lang="scss"></style>