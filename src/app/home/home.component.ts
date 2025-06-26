import {Component, OnInit} from '@angular/core';
import {createHttpObservable} from "../common/util";
import {map} from "rxjs/operators";
import {Course} from "../model/course";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  private url: string = 'http://localhost:9000/api/courses'

  beginnerCourses: Course[];
  advancedCourses: Course[];

  ngOnInit() {
    const http$ = createHttpObservable(this.url);
    http$.pipe(
      map(data => Object.values(data['payload'])),
      map(objects => objects.map(
        (object) => ({
          id: object['id'],
          description: object['description'],
          iconUrl: object['iconUrl'],
          courseListIcon: object['courseListIcon'],
          longDescription: object['longDescription'],
          category: object['category'],
          lessonsCount: object['lessonsCount'],
        } as Course)
      ))
    ).subscribe(courses => {
      this.beginnerCourses = courses.filter(course => course.category === 'BEGINNER');
      this.advancedCourses = courses.filter(course => course.category === 'ADVANCED');
    });
  }
}
