import { BehaviorSubject, type Observable } from 'rxjs';
import { type FormPage } from '../../types';

class PageObserver {
  private scrollablePagesSubject = new BehaviorSubject<Array<FormPage>>([]);
  private pagesWithErrorsSubject = new BehaviorSubject<Set<string>>(new Set());
  private activePagesSubject = new BehaviorSubject<Set<string>>(new Set());
  private evaluatedPagesVisibilitySubject = new BehaviorSubject<boolean>(null);

  setEvaluatedPagesVisibility(evaluatedPagesVisibility: boolean): void {
    this.evaluatedPagesVisibilitySubject.next(evaluatedPagesVisibility);
  }

  updateScrollablePages(newPages: Array<FormPage>): void {
    this.scrollablePagesSubject.next(newPages);
  }

  updatePagesWithErrors(newErrors: string[]): void {
    this.pagesWithErrorsSubject.next(new Set(newErrors));
  }

  addActivePage(pageId: string): void {
    const currentActivePages = this.activePagesSubject.value;
    currentActivePages.add(pageId);
    this.activePagesSubject.next(currentActivePages);
  }

  removeInactivePage(pageId: string): void {
    const currentActivePages = this.activePagesSubject.value;
    currentActivePages.delete(pageId);
    this.activePagesSubject.next(currentActivePages);
  }

  getActivePagesObservable(): Observable<Set<string>> {
    return this.activePagesSubject.asObservable();
  }

  getScrollablePagesObservable(): Observable<Array<FormPage>> {
    return this.scrollablePagesSubject.asObservable();
  }

  getPagesWithErrorsObservable(): Observable<Set<string>> {
    return this.pagesWithErrorsSubject.asObservable();
  }

  getEvaluatedPagesVisibilityObservable(): Observable<boolean> {
    return this.evaluatedPagesVisibilitySubject.asObservable();
  }

  clear(): void {
    this.scrollablePagesSubject.next([]);
    this.pagesWithErrorsSubject.next(new Set());
    this.activePagesSubject.next(new Set());
    this.evaluatedPagesVisibilitySubject.next(false);
  }
}

export const pageObserver = new PageObserver();
