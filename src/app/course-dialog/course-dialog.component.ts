import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import moment from 'moment';
import {exhaustMap, filter} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable} from "rxjs";

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  standalone: false
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  course: Course;

  @ViewChild('saveButton', {static: true}) saveButton: ElementRef;

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });
  }

  ngAfterViewInit(): void {
    // FIXME: implement a fromEvent stream with exhaustMap
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        exhaustMap(formData => this.saveCourse(formData))
      )
      .subscribe(formData => {
      });
  }

  save() {
    console.log('Saving course')
    console.log(this.form.value);
  }

  saveCourse(formData): Observable<Response> {
    return fromPromise(fetch(`http://127.0.0.1:9000/api/courses/${this.course.id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  close() {
    this.dialogRef.close();
  }
}
