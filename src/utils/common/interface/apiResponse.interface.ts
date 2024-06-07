export interface ApiResponse<T=object> {
    status:string;
    data:T
}