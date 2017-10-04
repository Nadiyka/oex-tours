<template>
    <div class="dropdown-menu" @click="toggleMenu" v-on-clickaway="closeMenu">
        Показать цену
        <div class="sort">
            <i class="icon-arrow"></i>
        </div>
        <ul v-show="showMenu">
            <li>
                <input style="display:none" id="netto" type="radio" value="agent" v-model="priceType" @click="changePriceType">
                <label class="checkbox" for="netto">Агент</label>
            </li>
            <li>
                <input style="display:none" type="radio" id="brutto" value="tourist" v-model="priceType" @click="changePriceType">
                <label class="checkbox" for="brutto">Турист</label>
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
                priceType: 'tourist',
                showMenu: false
            }
        },
        methods: {
            changePriceType() {
                this.$emit('changePriceType', this.priceType)
            },
            toggleMenu() {
                this.showMenu = !this.showMenu;
            },
            closeMenu() {
                this.showMenu = false;
            }
        },
        directives: {
            onClickaway: onClickaway,
        }
    }
</script>
<style lang="scss"></style>