import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators'
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-04-2020.csv"
  constructor(private http : HttpClient) { }

  getGlobalData(){
      return this.http.get(this.globalDataUrl,{responseType : "text"}).pipe(
        map(result => {
          //let data : GlobalDataSummary[] = []
          let raw : [] = []//??
          let rows = result.split('\n');
          rows.splice(0,1);
          rows.forEach(row => {
            let columns = row.split(/,(?=\S)/);
            let cs = {
              country : columns[3],
              confirmed : +columns[7],
              deaths : +columns[8],
              recovered : +columns[9],
              active : +columns[10],
            };
            let temp : GlobalDataSummary = raw[cs.country]
            if(temp){
              temp.active = cs.active + temp.active
              temp.confirmed = cs.confirmed + temp.confirmed
              temp.deaths = cs.deaths + temp.deaths
              temp.recovered = cs.recovered + temp.recovered
              raw[cs.country] = temp;
            }else{
              raw[cs.country] = cs;
            }
          });
          
          return <GlobalDataSummary []>Object.values(raw);
        })
      )
  }
}
