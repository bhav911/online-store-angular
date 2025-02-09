import { Component, inject, input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: '../../styles/form.css'
})
export class ResetPasswordComponent {

  private router = inject(Router);

  private authService = inject(AuthService);

  token = input<string>();
  userId = '';
  passwordChange = false;
  message = ""
  isFormSubmitted = false;

  invalidMessage = "";

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(30)]
    }),
  })

  ngOnInit(): void {
    this.formControls.email.valueChanges.subscribe(val => {
      this.invalidEmail();
    })
    this.formControls.password.valueChanges.subscribe(val => {
      this.invalidPassword();
    })
    if (this.token()) {
      this.authService.validatePasswordResetToken(this.token()!)
        .subscribe({
          next: userId => {
            this.userId = userId
            this.passwordChange = true
          },
          error: error => {
            this.message = error
          }
        })
    }
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    this.isFormSubmitted = true;

    if (this.passwordChange) {
      if (this.invalidPassword()) {
        return;
      }
    }
    else {
      if (this.invalidEmail()) {
        return;
      }
    }

    let user = {
      email: this.formControls.email.value,
      password: this.formControls.password.value,
    }

    let Ops = null;
    switch (this.passwordChange) {
      case true: {
        let userObject = {
          userId: this.userId,
          password: user.password,
          token: this.token()
        }
        Ops = this.authService.resetPasswordValue(userObject);
        break;
      }
      case false: {
        Ops = this.authService.resetPasswordMail(user.email!);
        break;
      }
    }

    Ops.subscribe({
      next: email => {        
        if (email) {
          this.router.navigate(['/login'], {
            replaceUrl: true,
            state: {
              email: email
            }
          })
        }
      },
      error: errorMessage => {
        this.message = errorMessage
        setTimeout(() => {
          this.message = ""
        }, 3000);
      }
    })
  }

  invalidEmail() {
    const email = this.formControls.email;
    const hasError = email.touched && email.dirty && email.invalid || this.isFormSubmitted && email.invalid;
    if (hasError) {
      if (email.hasError('email')) {
        this.invalidMessage = "Invalid email address"
      }
      else if (email.hasError('required')) {
        this.invalidMessage = "Email is required"
      }
    }
    else {
      this.invalidMessage = ""
    }
    return hasError;
  }

  invalidPassword() {
    const password = this.formControls.password;
    const hasError = password.touched && password.dirty && password.invalid || this.isFormSubmitted && password.invalid;
    if (hasError) {
      if (password.hasError('minlength')) {
        this.invalidMessage = "Password length must be 6 or more"
      }
      else if (password.hasError('maxlength')) {
        this.invalidMessage = "Password length must be 30 or less"
      }
      else if (password.hasError('required')) {
        this.invalidMessage = "Password is required"
      }
    }
    else {
      this.invalidMessage = ""
    }
    return hasError;
  }
}
