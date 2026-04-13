import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  GET_ALL_EMPLOYEES,
  GET_EMPLOYEE_BY_ID,
  SEARCH_BY_DEPARTMENT,
  SEARCH_BY_DESIGNATION,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
} from '../../graphql/queries';
import { environment } from '../../../environments/environment';

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
  date_of_joining: string;
  department: string;
  designation: string;
  employee_photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo
      .query<any>({ query: GET_ALL_EMPLOYEES })
      .pipe(
        map(result => result.data.getAllEmployees),
        catchError(err => throwError(() => new Error(err.graphQLErrors?.[0]?.message || err.message)))
      );
  }

  getEmployeeById(eid: string): Observable<Employee> {
    return this.apollo
      .query<any>({ query: GET_EMPLOYEE_BY_ID, variables: { eid } })
      .pipe(
        map(result => result.data.searchEmployeeByEid),
        catchError(err => throwError(() => new Error(err.graphQLErrors?.[0]?.message || err.message)))
      );
  }

  searchByDepartment(department: string): Observable<Employee[]> {
    return this.apollo
      .query<any>({ query: SEARCH_BY_DEPARTMENT, variables: { department } })
      .pipe(
        map(result => result.data.searchEmployeeByDepartment),
        catchError(err => throwError(() => new Error(err.graphQLErrors?.[0]?.message || err.message)))
      );
  }

  searchByDesignation(designation: string): Observable<Employee[]> {
    return this.apollo
      .query<any>({ query: SEARCH_BY_DESIGNATION, variables: { designation } })
      .pipe(
        map(result => result.data.searchEmployeeByDesignation),
        catchError(err => throwError(() => new Error(err.graphQLErrors?.[0]?.message || err.message)))
      );
  }

  addEmployee(input: Partial<Employee>): Observable<Employee> {
    return this.apollo
      .mutate<any>({ mutation: ADD_EMPLOYEE, variables: { input } })
      .pipe(
        map(result => result.data.addEmployee),
        catchError(err => throwError(() => new Error(err.graphQLErrors?.[0]?.message || err.message)))
      );
  }

  updateEmployee(eid: string, input: Partial<Employee>): Observable<Employee> {
    return this.apollo
      .mutate<any>({ mutation: UPDATE_EMPLOYEE, variables: { eid, input } })
      .pipe(
        map(result => result.data.updateEmployee),
        catchError(err => throwError(() => new Error(err.graphQLErrors?.[0]?.message || err.message)))
      );
  }

  deleteEmployee(eid: string): Observable<string> {
    return this.apollo
      .mutate<any>({ mutation: DELETE_EMPLOYEE, variables: { eid } })
      .pipe(
        map(result => result.data.deleteEmployee),
        catchError(err => throwError(() => new Error(err.graphQLErrors?.[0]?.message || err.message)))
      );
  }

  uploadPhoto(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post<{ url: string }>(environment.uploadUrl, formData);
  }
}
