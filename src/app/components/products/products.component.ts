import { Component, OnInit } from '@angular/core';

import { CreateProduct, Product, UpdateProduct } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService,  } from '../../services/products.service';
import { id } from 'date-fns/locale';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail: boolean = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category:{ 
      id: '',
      name: ''
    },
    description: ''
  };

  limit = 10;
  offset = 0;
  statusDefault: 'loading' | 'success' | 'error' | 'init' = 'init'

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts(10, 0)
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDefault = 'loading'
    this.productsService.getProduct(id)
      .subscribe(data => {
        this.toggleProductDetail();
        this.productChosen = data;
        this.statusDefault = 'success'
      }, errorMsg => {
        window.alert(errorMsg)
        this.statusDefault = 'error';
      });
  }

  cretateNewProduct() {
    const product: CreateProduct = {
      price: 11,
      images: ['wewe', 'ewe'],
      title: 'New',
      categoryId: 3,
      description: 'lorem insu pomo hjugdvac'
    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data)
    })
  }

  updateProduct() {
    const change:UpdateProduct  = {
      title: ' nuevo título',
      description: 'this is the new description, so this part will be changes'
    }
    const id = this.productChosen.id
    this.productsService.update(id, change)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === id)
      this.products[productIndex] = data;
      this.productChosen
    })
  }

  deleteProduct(){
    const id = this.productChosen.id
    this.productsService.delete(id)
      .subscribe(() => {
        const productIndex = this.products.findIndex(item => item.id === id);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });
  }

  loadMore() {
    this.productsService.getAllProductsByPage(this.limit, this.offset)
    .subscribe(data => {
     this.products = this.products.concat(data);
      this.offset += this.limit
    });
  }

}
