import { injectable } from "inversify";
import { SuccessResult, ErrorResult } from "open-graph-scraper";
import { URL } from "node:url";
import axios from "axios";

const ogs = require("open-graph-scraper");

@injectable()
export class OpenGraphReader {
  async read(urlString: string) {
    try {
      const { data } = await axios.get(urlString, {
        headers: {
          "Content-Type": `text/html; charset="utf-8"`,
        },
      });

      const ogResult: SuccessResult | ErrorResult = await ogs({
        html: data,
      });

      if (ogResult.error) {
        return null;
      }

      const url = new URL(urlString);

      return {
        ...ogResult.result,
        title: ogResult.result.ogTitle,
        description: ogResult.result.ogDescription,
        domain: url.hostname,
        imageUrl: ogResult.result.ogImage
          ? ogResult.result.ogImage[0]?.url ?? ""
          : "",
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
