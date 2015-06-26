var App;

(function ($) {

    'use strict';
    App = {

        currency:       "£",
        VATpercentage:  20,
        subtotal:       0,
        VATamount:      0,
        total:          0,
        basket: [
            {
                item: "Cotton T Shirt",
                size: "Medium", 
                price: 1.99,
                quantity: 1
            },
            {
                item: "Baseball Cap",
                size: "One Size", 
                price: 2.99,
                quantity: 2 
            },
            {
                item: "Swim Shorts",
                size: "Medium", 
                price: 3.99,
                quantity: 1 
            },
        ],

        /**
         * Basket load all
         *
         */
        basketLoad: function() {

            var objectThis = this;
            // add a row for each item in basket
            $.each(objectThis.basket, function( key, val ) {
                $('<div id="row_' + key + '" class="item">').addClass('row')
                    .append( $('<div>').addClass('cell')
                        .append( $('<p>').html(
                            val.item + ', ' + val.size
                        ) ) 
                    )
                    .append( $('<div class="rowPrice">').addClass('cell')
                        .append( $('<p>').html(
                            objectThis.currency + val.price
                        ) ) 
                    )
                    .append( $('<div class="rowQuantity">').addClass('cell')
                        .append( $('<input type="number" min="1" max="10" step="1" value="' + val.quantity + '" class="qty">').html(
                            val.quantity
                        ) ) 
                    )
                    .append( $('<div class="rowTotal">').addClass('cell')
                        .append( $('<p>').html(
                            objectThis.currency + parseFloat(val.quantity * val.price).toFixed(2)
                        ) ) 
                    )
                    .append( $('<div>').addClass('remove') )
                    .appendTo('.basket');
            });
            // update totals
            objectThis.updateTotals();
            // add total row
            objectThis.addTotalRow();
        },

        /**
         * changeQuantity
         *
         */
        addTotalRow: function() {

            var objectThis = this;
            // append subtotal, vat and total rows
            $('<div id="subtotal">').addClass('row')
                .append( $('<div>').addClass('cell')
                    .html('Subtotal' ) )
                .append( $('<div>').addClass('cell')
                    .append( $('<p>').html() ) )
                .append( $('<div>').addClass('cell')
                    .append( $('<p>').html() ) )
                .append( $('<div>').addClass('cell subtotal')
                    .append( $('<p>').html( objectThis.currency + objectThis.getSubtotal() ) ) )
                .appendTo('.basket');

            $('<div id="vat">').addClass('row')
                .append( $('<div>').addClass('cell')
                    .html('VAT @ ' + objectThis.VATpercentage + '%' ) ) 
                .append( $('<div>').addClass('cell')
                    .append( $('<p>').html() ) )
                .append( $('<div>').addClass('cell')
                    .append( $('<p>').html() ) )
                .append( $('<div>').addClass('cell vatAmount')
                    .append( $('<p>').html( objectThis.currency + objectThis.getVATamount()) ) )
                .appendTo('.basket');

            $('<div id="total">').addClass('row')
                .append( $('<div>').addClass('cell bold')
                    .append( $('<p>').html( 'Total Cost' ) ) )
                .append( $('<div>').addClass('cell')
                    .append( $('<p>').html() ) )
                .append( $('<div>').addClass('cell')
                    .append( $('<p>').html() ) )
                .append( $('<div>').addClass('cell total bold')
                    .append( $('<p>').html( objectThis.currency + objectThis.getTotal()) ) )
                .appendTo('.basket');

        },

        /**
         * changeQuantity
         *
         */
        changeQuantity: function() {

            var objectThis = this;

            $('.qty').on('change', function() {
                // grab the new quantity
                var newQuantity = $(this).val();
                // get the row id and object index
                var row_id = $(this).parents('div:eq(1)').attr('id').replace(/row_/, '');
                // update basket object with new quantity 
                objectThis.basket[row_id].quantity = newQuantity;
                // update row total on DOM
                $('#row_' + row_id).find('.rowTotal').text(objectThis.currency + parseFloat(objectThis.basket[row_id].price * newQuantity).toFixed(2));
                // update totals
                objectThis.updateTotals();
            });

        },

        /**
         * removeItem
         *
         */
        removeItem: function() {

            var objectThis = this;

            $('.remove').on('click', function() {
                // Get the index of the row
                var index = $(this).parent().attr('id').replace(/row_/, '');
                // remove item from basket
                objectThis.basket.splice(index, 1);
                // remove from dom
                $('#row_' + index).remove();
                // re-index dom
                $('.item').each(function(i,e){
                    if (!i) {
                        $(this).attr('id','row_0');
                    } else {
                        $(this).attr('id','row_'+ i);
                    }
                });
                // update the totals
                objectThis.updateTotals();
            });

        },

        /**
         * updateTotals
         *
         */
        updateTotals: function() {

            var objectThis = this;
            var subtotal = 0

            // for each item in basket, calculate subtotal
            $.each(objectThis.basket, function( key, val ) {
                subtotal += parseFloat(val.quantity * val.price);
            });
            // update object subtotal
            objectThis.subtotal = subtotal;
            // update object VAT amount
            objectThis.VATamount = parseFloat(objectThis.subtotal / 100 * objectThis.VATpercentage);
            // update object total
            objectThis.total = parseFloat(objectThis.subtotal + objectThis.VATamount);
            // update DOM subtotal
            $('#subtotal').find('.subtotal').find('p').text(objectThis.currency + objectThis.getSubtotal());
            // update DOM VAT amount
            $('#vat').find('.vatAmount').find('p').text(objectThis.currency + objectThis.getVATamount());
            // update DOM total
            $('#total').find('.total').find('p').text(objectThis.currency + objectThis.getTotal());

        },



        /**
         * getVATamount
         *
         */
        getVATamount: function() {
            return parseFloat(this.VATamount).toFixed(2);
        },
        
        /**
         * getSubtotal
         *
         */
        getSubtotal: function() {
            return parseFloat(this.subtotal).toFixed(2);
        },
                
        /**
         * getTotal
         *
         */
        getTotal: function() {
            return parseFloat(this.total).toFixed(2);
        },
        
        /**
         * init
         *
         */
        init: function() {
          // fill basket
          this.basketLoad();
          // change quantity change event
          this.changeQuantity();
          // remove item change event
          this.removeItem();
        }
    };

  // call init function
  window.onload = App.init();

})(jQuery);
