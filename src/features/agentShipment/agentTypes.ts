export interface StatusUpdate{
    status:string;
    remarks?:string;
}
export interface UpdateTrackStatus{
    id:string;
    data:string;
}
export interface AgentState {
  shipments: AgentResponse[];
  loading: boolean;
  error: string | null;
}