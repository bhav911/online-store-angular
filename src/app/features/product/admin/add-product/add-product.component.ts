import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../_services/product.service';
import { Product } from '../../../../core/models/Product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {

  private productService = inject(ProductService);

  private route = inject(Router);

  productId = input<string>();

  isFormSubmitted = false;

  errorMessage: any = {
    invalidTitleMessage: "",
    invalidImageMessage: "",
    invalidPriceMessage: "",
    invalidDescriptionMessage: "",
  }

  productForm = new FormGroup({
    title: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
    }),
    image: new FormControl<File | null>(null, {
      validators: [Validators.required]
    }),
    price: new FormControl(0, {
      validators: [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1)]
    }),
    description: new FormControl('', {
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(500)]
    })
  })

  ngOnInit(): void {
    if (this.productId()) {
      this.productService.getProduct(this.productId()!)
        .subscribe({
          next: product => {
            this.productForm.patchValue(product);
          }
        })
    }

    this.formControls.title.valueChanges.subscribe(() => {
      this.invalidTitle();
    })
    this.formControls.description.valueChanges.subscribe(() => {
      this.invalidDescription();
    })
    this.formControls.price.valueChanges.subscribe(() => {
      this.invalidPrice();
    })
    this.formControls.image.valueChanges.subscribe(() => {
      this.invalidImage();
    })
  }

  get formControls() {
    return this.productForm.controls
  }

  addProduct() {
    this.isFormSubmitted = true;
    let invalidForm = this.invalidTitle() || this.invalidDescription() || this.invalidImage() || this.invalidPrice();
    if (invalidForm) {
      return;
    }

    const formData = new FormData();

    formData.append('title', this.formControls.title.value!);
    formData.append('description', this.formControls.description.value!);
    formData.append('image', this.formControls.image.value!);
    formData.append('price', this.formControls.price.value!.toString());

    let serviceCall = this.productId() ? this.productService.updateProduct(this.productId()!, formData) : this.productService.addProduct(formData);

    serviceCall.subscribe({
      next: status => {
        this.route.navigate(['/admin', 'products'], {
          queryParams: {
            role: 'admin'
          }
        })
      },
      error: errorMessage => {
        console.log(errorMessage);
      }
    })
  }

  imageFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.productForm.patchValue({ image: file });
      this.productForm.controls.image.markAsDirty();
    } else {
      console.error('The selected file is not an image.');
    }
  }

  invalidTitle() {
    const title = this.formControls.title;
    const hasError = title.touched && title.dirty && title.invalid || this.isFormSubmitted && title.invalid
    if (hasError) {
      if (title.hasError('minlength')) {
        this.errorMessage.invalidTitleMessage = "Title is too short"
      }
      else if (title.hasError('maxlength')) {
        this.errorMessage.invalidTitleMessage = "Title is too long"
      }
      else if (title.hasError('required')) {
        this.errorMessage.invalidTitleMessage = "Title is required"
      }
    }
    else {
      this.errorMessage.invalidTitleMessage = "";
    }
    return hasError;
  }

  invalidPrice() {
    const price = this.formControls.price;
    const hasError = price.touched && price.dirty && price.invalid || this.isFormSubmitted && price.invalid;
    if (hasError) {
      if (price.hasError('required')) {
        this.errorMessage.invalidPriceMessage = "Price is required"
      }
      else if (price.hasError('pattern')) {
        this.errorMessage.invalidPriceMessage = "Only numbers are allowed"
      }
      else if (price.hasError('min')) {
        this.errorMessage.invalidPriceMessage = "Price must be greater than 0"
      }
    }
    else {
      this.errorMessage.invalidPriceMessage = ""
    }
    return hasError;
  }

  invalidDescription() {
    const description = this.formControls.description;
    const hasError = description.touched && description.dirty && description.invalid || this.isFormSubmitted && description.invalid;
    if (hasError) {
      if (description.hasError('minlength')) {
        this.errorMessage.invalidDescriptionMessage = "Description is too short"
      }
      else if (description.hasError('maxlength')) {
        this.errorMessage.invalidDescriptionMessage = "Description is too long"
      }
      else if (description.hasError('required')) {
        this.errorMessage.invalidDescriptionMessage = "Description is required"
      }
    }
    else {
      this.errorMessage.invalidDescriptionMessage = ""
    }
    return hasError;
  }

  invalidImage() {
    const imageUrl = this.formControls.image;
    const hasError = !this.productId() && (imageUrl.touched && imageUrl.dirty && imageUrl.invalid || this.isFormSubmitted && imageUrl.invalid);
    if (hasError) {
      if (imageUrl.hasError('required')) {
        this.errorMessage.invalidImageUrlMessage = "ImageUrl is required"
      }
    }
    else {
      this.errorMessage.invalidImageUrlMessage = ""
    }
    return hasError;
  }
}
