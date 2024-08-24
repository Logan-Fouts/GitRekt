import { Octokit } from "@octokit/core";

class APIService {
  constructor(owner, repo, token) {
    this.repo = repo;
    this.owner = owner;
    this.token = token;
    this.octokit = new Octokit({ auth: this.token });
  }

  async getGeneralRepoInfo() {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}', {
        owner: this.owner,
        repo: this.repo
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching repo info:", error);
      throw error;
    }
  }
}

export default APIService;