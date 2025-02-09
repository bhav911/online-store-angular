import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, catchError, filter, map, tap, throwError } from "rxjs";
import { User } from "../models/User";
import { CsrfService } from "./csrf.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    private csrfService = inject(CsrfService)

    private _user = new BehaviorSubject<User | undefined | null>(undefined);
    user = this._user.asObservable();

    constructor() {
        const jwtToken = localStorage.getItem('token');
        const tokenExpiryDate = localStorage.getItem('expiryDate');
        if (tokenExpiryDate && new Date(tokenExpiryDate).getTime() > Date.now() && jwtToken) {
            let graphQLQuery = {
                query: `
                    {
                        authStatus
                    }
                `
            }
            this.http.post<User>(environment.backendUrl + '/graphql', graphQLQuery)
                .subscribe({
                    next: ({ data }: any) => {
                        let userId = data.authStatus
                        if (!userId) {
                            this.emptyLocalStorage();
                        }
                        this._user.next(userId)
                    }
                })
        }
        else {
            this._user.next(null)
        }
    }

    get userValue() {
        return this._user
            .pipe(
                filter(u => u !== undefined),
            )
    }

    emptyLocalStorage() {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('expiryDate')
    }

    authenticateUser(userCredentials: any) {
        let graphQLQuery = {
            query: `
                query authenticateUser($email: String!, $password: String!) {
                    login(email: $email, password: $password)
                    {
                        token userId email
                    }
                }
            `,
            variables: {
                email: userCredentials.email,
                password: userCredentials.password
            }
        }
        return this.http.post(environment.backendUrl + '/graphql', graphQLQuery)
            .pipe(
                tap(({ data }: any) => {
                    localStorage.setItem('token', data.login.token)
                    localStorage.setItem('userId', data.login.userId)
                    const remainingMiliseconds = 60 * 60 * 1000;
                    const expiryDate = new Date(new Date().getTime() + remainingMiliseconds)
                    localStorage.setItem('expiryDate', expiryDate.toISOString())
                    this._user.next(data.login.userId);
                }),
                catchError((error: HttpErrorResponse) => {
                    let message = "";
                    if (error.error.errors[0].data) {
                        message = error.error.errors[0].data[0].message
                    }
                    else {
                        message = error.error.errors[0].message
                    }
                    console.log('Failed to login User: ' + message);
                    return throwError(() => {
                        return { message };
                    });
                })
            )
    }

    registerUser(userInfo: any) {
        let graphQLQuery = {
            query: `
                mutation createUser($email: String!, $password: String!, $confirmPassword: String!) {
                    createUser(userInput: {
                        email: $email,
                        password: $password,
                        confirmPassword: $confirmPassword
                    })
                }
            `,
            variables: {
                email: userInfo.email,
                password: userInfo.password,
                confirmPassword: userInfo.confirmPassword
            }
        }


        return this.http.post<User>(environment.backendUrl + '/graphql', graphQLQuery)
            .pipe(
                map(({ data }: any) => {
                    return data.createUser
                }),
                catchError((error: HttpErrorResponse) => {
                    let message = "";
                    if (error.error.errors[0].data) {
                        message = error.error.errors[0].data[0].message
                    }
                    else {
                        message = error.error.errors[0].message
                    }
                    console.log('Failed to register User: ' + message);
                    return throwError(() => {
                        return { message };
                    });
                })
            )
    }

    resetPasswordValue(userObject: any) {
        const graphQLQuery = {
            query: `
                mutation resetPassword($userId: String!, $password: String!, $token: String!)  {
                    resetPassword(resetPasswordInput: {
                        userId: $userId,    
                        password: $password, 
                        token: $token
                    })
                }
            `,
            variables: {
                userId: userObject.userId,
                password: userObject.password,
                token: userObject.token
            }
        }
        return this.http.post<string>(environment.backendUrl + '/graphql', graphQLQuery)
            .pipe(
                map(({ data }: any) => {
                    return data.resetPassword
                }),
                catchError((error: HttpErrorResponse) => {
                    console.log('Something went wrong: ' + error);
                    return throwError(() => error.error.message || 'Something went wrong');
                })
            )
    }

    validatePasswordResetToken(token: string) {
        const graphQLQuery = {
            query: `
                query validatePassResetToken($token: String!) {
                    validatePassResetToken(token: $token)
                }
            `,
            variables: {
                token: token
            }
        }
        return this.http.post<string>(environment.backendUrl + '/graphql', graphQLQuery)
            .pipe(
                map(({ data }: any) => {
                    this.emptyLocalStorage();
                    return data.validatePassResetToken
                }),
                catchError((error: HttpErrorResponse) => {
                    console.log('Something went wrong: ' + error);
                    return throwError(() => error.error.message || 'Something went wrong');
                })
            )
    }

    resetPasswordMail(email: string) {
        const graphQLQuery = {
            query: `
                mutation sendPassResetMail($email: String!) {
                    sendPassResetMail(email: $email)
                }
            `,
            variables: {
                email: email
            }
        }
        return this.http.post<String>(environment.backendUrl + '/graphql', graphQLQuery)
            .pipe(
                map(({ data }: any) => {
                    return data.sendPassResetMail
                }),
                catchError((error: HttpErrorResponse) => {
                    console.log('Something went wrong: ' + error);
                    return throwError(() => error.error.message || 'Something went wrong');
                })
            )
    }

    logout() {
        this._user.next(null);
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('expiryDate')
    }
}