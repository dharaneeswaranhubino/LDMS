export interface StatusUpdate{
    status:string;
    remarks?:string;
}
export interface UpdateTrackStatus{
    id:string;
    data:StatusUpdate;
}
export interface AgentState {
  shipments: AgentResponse[];
  loading: boolean;
  error: string | null;
}