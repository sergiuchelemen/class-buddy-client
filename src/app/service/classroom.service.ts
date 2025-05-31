import {environment} from '../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable, tap} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ClassroomService {

  private _ownedClassrooms = new BehaviorSubject<any[]>([]);
  private _enrolledClassrooms = new BehaviorSubject<any[]>([]);

  public ownedClassrooms$: Observable<any[]> = this._ownedClassrooms.asObservable();
  public enrolledClassrooms$: Observable<any[]> = this._enrolledClassrooms.asObservable()

  constructor(private http: HttpClient) {
  }

  public getOwnedClassrooms() {
    return this.http.get<any>(`${environment.apiBaseUrl}/owned-classrooms`);
  }

  public getEnrolledClassrooms() {
    return this.http.get<any>(`${environment.apiBaseUrl}/enrolled-classrooms`);
  }

  public getClassroom(classroomId: number) {
    return this.http.get<any>(`${environment.apiBaseUrl}/${classroomId}`);
  }

  public getAllClassrooms(): Observable<{ owned: any[]; enrolled: any[] }> {
    return forkJoin({
      owned: this.getOwnedClassrooms(),
      enrolled: this.getEnrolledClassrooms()
    }).pipe(
      tap(({ owned, enrolled }) => {
        this._ownedClassrooms.next(owned);
        this._enrolledClassrooms.next(enrolled);
      })
    );
  }

  public joinClassroom(classroomCode: string) {
    const body = {
      classroomCode: classroomCode,
    }
    return this.http.post<any>(`${environment.apiBaseUrl}/join-classroom`, body);
  }

  public createClassroom(classroom: any) {
    return this.http.post<any>(`${environment.apiBaseUrl}/create-classroom`, classroom);
  }

  public getAnnouncements(classroomId: number) {
    return this.http.get<any>(`${environment.apiBaseUrl}/announcements/${classroomId}`);
  }

  public createAnnouncement(classroomId: number, message: string) {
    const body = {
      message: message,
    }
    return this.http.post<any>(`${environment.apiBaseUrl}/announcements/${classroomId}`, body);
  }

  public getComments(announcementId: number){
    return this.http.get<any[]>(`${environment.apiBaseUrl}/announcements/${announcementId}/comments`);
  }

  public addComment(announcementId: number, message: string) {
    const body = { message };
    return this.http.post<any>(`${environment.apiBaseUrl}/announcements/${announcementId}/comments`, body);
  }

  public addHomework(classroomId: number, title: string | undefined, description: string | undefined, file: File | undefined, dueDate: Date | undefined) {
    const form = new FormData();
    if (title != null) {
      form.append('title', title);
    }
    if (description != null) {
      form.append('description', description);
    }
    if (dueDate) {
      const dt = new Date(dueDate);
      form.append('dueDate', dt.toISOString().slice(0, 19));
    }
    if (file != null) {
      form.append('file', file);
    }

    return this.http.post<any>(`${environment.apiBaseUrl}/homework/${classroomId}`, form);
  }

  getAllHomework(classroomId: number): Observable<[]> {
    return this.http.get<any>(`${environment.apiBaseUrl}/homework/all/${classroomId}`);
  }

  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${environment.apiBaseUrl}/files/download/${filename}`, {
      responseType: 'blob',
    });
  }

  submitFiles(homeworkId: number, files: File[] | null) {
    const form: FormData = new FormData();
    if (files && files.length > 0) {
      files.forEach(file => {
        form.append('submissionFiles', file, file.name);
      });
    }
    return this.http.post(`${environment.apiBaseUrl}/submission/${homeworkId}`, form);
  }

  getSubmissions(homeworkId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/submission/${homeworkId}`);
  }

  deleteClassroom(classroomId: number) {
    return this.http.delete(`${environment.apiBaseUrl}/${classroomId}`);
  }


  submitGrade(submissionId: number, grade: number): Observable<void> {
    const params = new HttpParams()
      .set('submissionId', submissionId.toString())
      .set('grade', grade.toString());

    return this.http.post<void>(`${environment.apiBaseUrl}/submission/grade`, null, { params });
  }
}
