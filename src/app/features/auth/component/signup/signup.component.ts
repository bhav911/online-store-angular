import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

function passwordMatch(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value === confirmPassword?.value) {
    return null;
  }
  return { passwordMatch: false };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: '../../styles/form.css'
})
export class SignupComponent implements OnInit {

  private router = inject(Router);

  private authService = inject(AuthService);
  isFormSubmitted = false;

  errorMessage: any = {
    invalidEmailMessage: "",
    invalidPasswordMessage: "",
    invalidConfirmPasswordMessage: "",
  }
  message = "";

  signupForm = new FormGroup({
    email: new FormControl('',
      { validators: [Validators.email, Validators.required] }
    ),
    passwords: new FormGroup(
      {
        password: new FormControl('',
          { validators: [Validators.required, Validators.minLength(6), Validators.maxLength(30)] }
        ),
        confirmPassword: new FormControl({ value: '', disabled: true })
      },
      { validators: [passwordMatch] }
    ),
  })

  ngOnInit(): void {
    this.formControls.email.valueChanges.subscribe(val => {
      this.invalidEmail();
    })
    this.formControlsOfPassword.password.valueChanges.subscribe(val => {
      this.isPasswordValid();
      this.invalidPassword();
    })
    this.formControls.passwords.valueChanges.subscribe(val => {
      this.invalidConfirmPassword();
    })
  }

  get formControls() {
    return this.signupForm.controls;
  }

  get formControlsOfPassword() {
    return this.signupForm.controls.passwords.controls;
  }

  isPasswordValid() {
    const isValid = this.formControlsOfPassword.password.valid;
    isValid ? this.formControlsOfPassword.confirmPassword.enable() : this.formControlsOfPassword.confirmPassword.disable();
  }

  onSubmit() {
    this.isFormSubmitted = true;

    let invalidForm = this.invalidEmail() || this.invalidPassword() || this.invalidConfirmPassword();
    if (invalidForm) {
      return
    }

    let user = {
      email: this.formControls.email.value,
      password: this.formControlsOfPassword.password.value,
      confirmPassword: this.formControlsOfPassword.confirmPassword.value,
    }

    this.authService.registerUser(user)
      .subscribe({
        next: email => {          
          this.router.navigate(['/login'], {
            replaceUrl: true,
            state: {
              email: email
            }
          })
        },
        error: errorMessage => {
          this.message = errorMessage.message;
          setTimeout(() => {
            this.message = "";
          }, 3000);
        }
      })
  }

  invalidEmail() {
    const email = this.formControls.email;
    const hasError = email.touched && email.dirty && email.invalid || this.isFormSubmitted && email.invalid;
    if (hasError) {
      if (email.hasError('email')) {
        this.errorMessage.invalidEmailMessage = "Invalid email address"
      }
      else if (email.hasError('required')) {
        this.errorMessage.invalidEmailMessage = "Email is required"
      }
    }
    else {
      this.errorMessage.invalidEmailMessage = ""
    }
    return hasError;
  }

  invalidPassword() {
    const password = this.formControlsOfPassword.password;
    const hasError = password.touched && password.dirty && password.invalid || this.isFormSubmitted && password.invalid;
    if (hasError) {
      if (password.hasError('minlength')) {
        this.errorMessage.invalidPasswordMessage = "Password length must be 6 or more"
      }
      else if (password.hasError('maxlength')) {
        this.errorMessage.invalidPasswordMessage = "Password length must be 30 or less"
      }
      else if (password.hasError('required')) {
        this.errorMessage.invalidPasswordMessage = "Password is required"
      }
    }
    else {
      this.errorMessage.invalidPasswordMessage = ""
    }
    return hasError;
  }

  invalidConfirmPassword() {
    const passwords = this.formControls.passwords;
    const confirmPassword = this.formControlsOfPassword.confirmPassword;
    const hasError = confirmPassword.touched && confirmPassword.dirty && passwords.invalid || this.isFormSubmitted && passwords.invalid;
    if (hasError) {
      if (!passwords.hasError('passwordMatch')) {
        this.errorMessage.invalidConfirmPasswordMessage = "Passwords do not match!"
      }
    }
    else {
      this.errorMessage.invalidConfirmPasswordMessage = ""
    }
    return hasError;
  }
}
