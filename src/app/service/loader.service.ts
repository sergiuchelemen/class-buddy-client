import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public showLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  start(): void {
    this.showLoading$.next(true);
  }

  stop(): void {
    this.showLoading$.next(false);
  }
}
