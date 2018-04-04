package com.erp.app.repository.search;

import com.erp.app.domain.Version;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Version entity.
 */
public interface VersionSearchRepository extends ElasticsearchRepository<Version, String> {
}
