import {Component, OnInit} from '@angular/core';
import {createHttpObservable} from "../common/util";
import {map, shareReplay} from "rxjs/operators";
import {Course} from "../model/course";
import {Observable} from "rxjs";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  private url: string = 'http://127.0.0.1:9000/api/courses'

  beginnerCourses: Observable<Course[]>;
  advancedCourses: Observable<Course[]>;

  ngOnInit() {
    const http$ = createHttpObservable(this.url);
    const courses$ = http$.pipe(
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
      )),
      shareReplay()
    );

    this.beginnerCourses = courses$.pipe(
      map(courses => courses.filter((course) => course.category === 'BEGINNER'))
    );
    this.advancedCourses = courses$.pipe(
      map(courses => courses.filter((course) => course.category === 'ADVANCED'))
    );
  }
}
