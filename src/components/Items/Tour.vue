<template>
    <div class="tour-item">
        <div class="tour-image">
            <img v-bind:src="tour.hotelsResult.picture" alt="Отель">
        </div>
        <div class="tour-description">
            <div class="tour-package">
                <i class="icon-tour"></i>
                <span>пакетный тур</span>
            </div>
            <div class="tour-category">
                <i class="icon-star" v-for="star in tour.hotelsResult.accommodationStars"></i>
            </div>
            <div class="tour-hotel-name">{{tour.hotelsResult.accommodationHotelName}}</div>
            <div class="tour-info">
                <i class="icon-hotel"></i>
                <ul class="tour-services">
                    <li>
                        <span>Размещение:</span>
                        {{tour.hotelsResult.accommodationsAmount}} {{getNumEnding(tour.hotelsResult.accommodationsAmount)}}
                    </li>
                    <li>
                        <span>Питание:</span>
                        {{tour.hotelsResult.accommodationMealsAmount}} {{getNumEnding(tour.hotelsResult.accommodationMealsAmount)}}
                    </li>
                    <li>
                        <span>Подтверждение:</span>
                        <span class="tour-available tour-available-now" v-if="tour.hotelsResult.accommodationStatus == '1'">
                            мгновенное
                        </span>
                        <span class="tour-available tour-available-wait" v-else>
                            запрос
                        </span>
                    </li>
                </ul>
            </div>
            <div class="tour-map-link">
                <i class="icon-marker"></i>
                <span>На карте</span>
            </div>
            <div class="tour-info">
                <i class="icon-plane"></i>
                <ul class="tour-services tour-services-avia">
                    <li>
                        <span>Перелет:</span>
                        {{tour.flightsAmount}} {{getNumEnding(tour.flightsAmount)}}
                    </li>
                    <li>
                        <span>Трансфер:</span>
                        {{direction}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="tour-side">
            <div class="tour-price">
                от
                <span class="netto" v-show="priceType === 'agent'">{{nettoPrice}}</span>
                <span class="total-price">{{formatPrice}}</span>
                <span class="currency">{{tour.fullPrice.currency}}</span>
            </div>
            <div class="tour-to-booking">
                <a href="#"class="btn">
                    <span>К бронированию</span>
                </a>
            </div>
            <div class="tour-summary">
                <i class="icon-exclamation-circled-inversed"></i>
                <span class="tour-summary_text">
                   <span class="tour-summary_bold"> В стоимость тура входит:</span>
                проживание, перелет, трансфер,
                страховка
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Tour',
        data() {
            return {
                formatPrice: '',
                nettoPrice: '',
                variantEndings: [
                    'вариант',
                    'варианта',
                    'вариантов',
                    'вариантов'
                ],
                direction: ''
            }
        },
        props: {
            tour: {
                type: Object,
                required: true
            },
            priceType: {
                type: String,
                required: true
            }
        },
        mounted() {
            let price = Math.ceil(this.tour.fullPrice.price),
                markPrice = Math.ceil(this.tour.fullPrice.priceMark);

            this.formatPrice = this.numberWithCommas(price);

            price = price - markPrice;
            this.nettoPrice = `${this.numberWithCommas(price)} + ${this.numberWithCommas(markPrice)} = `;


            if (!this.tour.hotelsResult.picture.length) {
                this.tour.hotelsResult.picture = 'https://www.b17.ru/foto/uploaded/38dc5abadad52dc8367d506e9424a887.jpg'
            }

            this.direction = this.tour.transfersResult.direction == 'Return' ? 'туда - обратно' : (this.tour.transfersResult.direction == 'ToAirport' ? 'отель - аэропорт' : 'аэропорт - отель');
        },
        methods: {
            getNumEnding(iNumber) {
                let sEnding, i;
                iNumber = iNumber % 100;
                if (iNumber>=10 && iNumber<=19) {
                    sEnding=this.variantEndings[2];
                }
                else {
                    i = iNumber % 10;
                    switch (i)
                    {
                        case (0): sEnding = this.variantEndings[3] ? this.variantEndings[3] : this.variantEndings[0]; break;
                        case (1): sEnding = this.variantEndings[0]; break;
                        case (2):
                        case (3):
                        case (4): sEnding = this.variantEndings[1]; break;
                        default: sEnding = this.variantEndings[2];
                    }
                }
                return sEnding;
            },
            numberWithCommas(x) {
                let parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                return parts.join(".");
            }
        }
    }
</script>

<style lang="scss">
    $green-color: #2abb9b;
    $green-available-color: #3ba5a9;
    $yellow-color: #eed664;
    $blue-color: #1a6089;
    $red-color: #ff5829;
    $grey-color: #959595;
    $text-color: #585858;
    .tour {
        &-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #d8d8d8;
            padding: 10px 10px 15px 12px;
            width: 100%;
            color: $text-color;
            &:nth-of-type(even) {
                background-color: #f2f3f4;
            }
        }
        &-image {
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
        &-description {
            padding-left: 24px;
            width: 290px;
        }
        &-package {
            padding-bottom: 2px;
            border-bottom: 1px solid #d8d8d8;
            width: 100%;
            color: #333;
            font: 16px PTSansRegular, sans-serif;
            text-transform: uppercase;
            i {
                margin-right: 7px;
                margin-left: -6px;
                color: $green-color;
                font-size: 23px;
            }
        }
        &-category {
            padding-top: 5px;
            color: $yellow-color;
            font-size: 10px;
            i {
                margin-right: 4px;
            }
        }
        &-hotel-name {
            margin-top: -6px;
            color: $blue-color;
            font: 24px PTSansBold, sans-serif;
            text-decoration: underline;
        }
        &-info {
            display: flex;
            align-items: center;
            i {
                color: $green-color;
                font-size: 19px;
            }
        }
        &-services {
            padding: 0 0 0 14px;
            margin: 0;
            list-style: none;
            font-size: 14px;

            &-avia {
                padding-left: 10px;
            }

            span:not(.tour-available) {
                font-family: PTSansBold, sans-serif;
            }
        }
        &-available {
            font-family: PTSansRegular, sans-serif;
            &-now {
                color: $green-available-color;
            }
            &-wait {
                color: $yellow-color;
            }
        }
        &-map-link {
            display: flex;
            align-items: center;
            padding-bottom: 7px;
            padding-left: 29px;
            border-bottom: 1px solid #d8d8d8;
            color: $blue-color;
            font-size: 14px;
            i {
                color: $red-color;
                font-size: 18px;
            }
            span {
                padding-left: 10px;
                text-decoration: underline;
            }
        }
        &-side {
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            justify-content: space-between;
            padding-left: 20px;
            width: 340px;
            text-align: right;
        }
        &-price {
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
        &-to-booking {
            padding-right: 13px;
            a {
                width: 152px;
                height: 40px;
                justify-content: center;
                border-radius: 4px;
                color: white;
                font-family: PTSansBold, sans-serif;
                text-decoration: none;
                background-color: $green-color;
                box-shadow: 0 2px 0 0 rgba(16, 113, 92, 0.75);
            }
        }
        &-summary {
            display: flex;
            height: 55px;
            width: 226px;
            font-size: 14px;

            i {
                flex: 0 0 20px;
                color: $grey-color;
            }
            &_text {
                padding-left: 10px;
                text-align: left;
                word-spacing: -1px;
            }
            &_bold {
                font-family: PTSansBold, sans-serif;
            }
        }
    }
</style>