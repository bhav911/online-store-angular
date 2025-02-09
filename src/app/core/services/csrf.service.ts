import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CsrfService {
    private http = inject(HttpClient);

    private csrfToken = '';

    fetchCsrfToken() {
        return this.http.get<{ csrfToken: string }>(environment.backendUrl + '/csrf-token')
            .pipe(
                tap((response) => {
                    this.csrfToken = response.csrfToken;
                }));
    }

    getCsrfToken() {
        return this.csrfToken;
    }
}