import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ClassroomService} from '../service/classroom.service';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf} from '@angular/common';


@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.component.html',
  imports: [
    FormsModule,
    DatePipe,
    NgForOf
  ],
  styleUrls: ['./announcement-detail.component.css']
})
export class AnnouncementDetailComponent implements OnInit {
  announcement: any;
  comments: any[] = [];
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const classroomId = +routeParams.get('classroomId')!;
    const announcementId = +routeParams.get('id')!;

    this.classroomService.getAnnouncements(classroomId)
      .subscribe(all => {
        this.announcement = all.find((a: any) => a.id === announcementId);
      });

    this.classroomService.getComments(announcementId).subscribe(cs => this.comments = cs);
  }

  submitComment() {
    if (this.newComment.length === 0 || this.newComment === '') {
      return;
    }

    this.classroomService
      .addComment(this.announcement.id, this.newComment.trim())
      .subscribe(comment => {
        this.comments.push(comment);
        this.newComment = '';
      });
  }
}
