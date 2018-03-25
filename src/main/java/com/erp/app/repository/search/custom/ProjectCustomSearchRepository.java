package com.erp.app.repository.search.custom;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.erp.app.domain.custom.ProjectCustom;

/**
 * Spring Data Elasticsearch repository for the Epic entity.
 */

public interface ProjectCustomSearchRepository extends  ElasticsearchRepository<ProjectCustom, String> {
}
