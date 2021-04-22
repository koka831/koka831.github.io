class Moment {
  date: Date;

  constructor(date: string) {
    this.date = new Date(date);
  }

  // returns 'YYYY-MM-DD hh:mm:ss'
  toString(): string {
    const ymd = this.getYMD();
    const hms = this.getHMS();

    return `${ymd} ${hms}`;
  }

  getYMD(): string {
    const month = (this.date.getMonth() + 1).toString().padStart(2, "0");
    const date = this.date.getDate().toString().padStart(2, "0");
    return `${this.date.getFullYear()}-${month}-${date}`;
  }

  getHMS(): string {
    const hours = this.date.getHours().toString().padStart(2, "0");
    const minutes = this.date.getMinutes().toString().padStart(2, "0");
    const seconds = this.date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}

export default Moment;
